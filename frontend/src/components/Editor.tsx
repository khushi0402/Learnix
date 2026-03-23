"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function CodeEditor({ roomId }: any) {
  const [code, setCode] = useState("// Start coding...");

  useEffect(() => {
    socket.emit("join", roomId);

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });
  }, []);

  const handleChange = (value: any) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  return (
    <Editor
      height="500px"
      defaultLanguage="javascript"
      value={code}
      onChange={handleChange}
      theme="vs-dark"
    />
  );
}