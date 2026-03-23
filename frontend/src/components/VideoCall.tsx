"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import styles from "./videocall.module.css";

export default function VideoCall({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const targetRef = useRef<string | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteName, setRemoteName] = useState("Waiting...");

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }

        console.log("✅ Camera ready");
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    init();

    // 👥 USER LIST
    socket.on("user_list", (users: any[]) => {
      if (!socket.id) return;

      const other = users.find((u) => u.sid !== socket.id);
      if (!other) return;

      targetRef.current = other.sid;
      setRemoteName(other.username);

      // decide who starts call
      if (!peerRef.current && socket.id.localeCompare(other.sid) < 0) {
        startCall(other.sid);
      }
    });

    // 📞 OFFER
    socket.on("video_offer", async ({ offer, sender }) => {
      console.log("📥 Offer received");

      targetRef.current = sender;

      const peer = createPeer(sender);
      peerRef.current = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("video_answer", {
        target: sender,
        answer,
      });
    });

    // 📞 ANSWER
    socket.on("video_answer", async ({ answer }) => {
      if (!peerRef.current) return;

      if (peerRef.current.signalingState !== "have-local-offer") {
        console.warn("⚠️ Wrong state:", peerRef.current.signalingState);
        return;
      }

      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    // ❄️ ICE
    socket.on("ice_candidate", async ({ candidate }) => {
      try {
        if (peerRef.current && candidate) {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    socket.on("call_ended", () => {
      endCall(false);
    });

    return () => {
      socket.off("user_list");
      socket.off("video_offer");
      socket.off("video_answer");
      socket.off("ice_candidate");
      socket.off("call_ended");
    };
  }, []);

  // 🔥 CREATE PEER
  const createPeer = (sid: string) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // add local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current!);
      });
    }

    // receive remote stream
    peer.ontrack = (event) => {
      console.log("🎥 Remote stream received");

      if (remoteVideo.current && event.streams[0]) {
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    // send ICE
    peer.onicecandidate = (event) => {
      if (event.candidate && targetRef.current) {
        socket.emit("ice_candidate", {
          target: targetRef.current,
          candidate: event.candidate,
        });
      }
    };

    return peer;
  };

  // 📞 START CALL
  const startCall = async (sid: string) => {
    try {
      targetRef.current = sid;

      const peer = createPeer(sid);
      peerRef.current = peer;

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("video_offer", {
        target: sid,
        offer,
      });
    } catch (err) {
      console.error("Start call error:", err);
    }
  };

  // 🔴 LEAVE
  const leaveRoom = () => {
    endCall(true);
    socket.emit("leave_room", { roomId });
    window.location.reload();
  };

  const endCall = (notify = true) => {
    peerRef.current?.close();
    peerRef.current = null;

    if (remoteVideo.current) {
      remoteVideo.current.srcObject = null;
    }

    if (notify) socket.emit("end_call", { roomId });
  };

  // 🔇 MUTE
  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = isMuted;
    });
    setIsMuted(!isMuted);
  };

  // 🎥 CAMERA
  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = isCameraOff;
    });
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoGrid}>
        <div className={styles.videoBox}>
          <video ref={localVideo} autoPlay muted playsInline />
          <span>{username} (You)</span>
        </div>

        <div className={styles.videoBox}>
          <video ref={remoteVideo} autoPlay playsInline />
          <span>{remoteName}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <button onClick={toggleMute}>
            {isMuted ? "🔊" : "🔇"}
          </button>

          <button onClick={toggleCamera}>
            {isCameraOff ? "🎥" : "🚫"}
          </button>
        </div>

        <button className={styles.leave} onClick={leaveRoom}>
          Leave
        </button>
      </div>
    </div>
  );
}