"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./dashboard.module.css";
import Editor from "@monaco-editor/react";
import { socket } from "@/lib/socket";
import VideoCall from "@/components/VideoCall";

export default function Dashboard() {
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [username, setUsername] = useState("");

  const [code, setCode] = useState("// Start coding... 🚀");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("code_update", (newCode: string) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });

    socket.on("user_joined", (data) => {
      showMessage(`${data.username} joined the room 🎉`);
    });

    socket.on("user_left", (data) => {
      showMessage(`${data.username} left the room 👋`);
    });

    return () => {
      socket.off("connect");
      socket.off("code_update");
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, []);

  const emitJoin = (id: string) => {
    if (socket.connected) {
      socket.emit("join_room", { roomId: id, username });
    } else {
      socket.once("connect", () => {
        socket.emit("join_room", { roomId: id, username });
      });
      socket.connect();
    }
  };

  const createRoom = () => {
    if (!username.trim()) return;

    const id = Math.random().toString(36).substring(2, 8);
    setRoomId(id);
    setJoinedRoom(true);
    emitJoin(id);
  };

  const joinRoom = () => {
    if (!roomId || !username.trim()) return;

    setJoinedRoom(true);
    emitJoin(roomId);
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      setCode(newCode);
      return;
    }

    setCode(newCode);

    if (joinedRoom) {
      socket.emit("code_change", { roomId, code: newCode });
    }
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const res = await fetch("http://127.0.0.1:8000/execute/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch {
      setOutput("Error running code");
    }

    setLoading(false);
  };

  const showMessage = (msg: string) => {
    setPopup(msg);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2500);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>Learnix 🚀</h2>

        <input
          placeholder="Enter your name"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button className={styles.createBtn} onClick={createRoom}>
          + Create Room
        </button>

        <input
          placeholder="Enter Room ID"
          className={styles.input}
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button className={styles.joinBtn} onClick={joinRoom}>
          Join Room
        </button>
      </div>

      {/* Editor */}
      <div className={styles.editorContainer}>
        <div className={styles.topBar}>
          <h2>Live Editor ⚡</h2>

          <div className={styles.actions}>
            <select
              className={styles.select}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>

            <button onClick={runCode} className={styles.runBtn}>
              {loading ? "Running..." : "▶ Run"}
            </button>
          </div>
        </div>

        <div className={styles.editorWrapper}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
          />
        </div>

        <div className={styles.output}>
          <pre>{output}</pre>
        </div>

        {joinedRoom && (
          <VideoCall roomId={roomId} username={username} />
        )}
      </div>

      {showPopup && <div className={styles.popup}>{popup}</div>}
    </div>
  );
}