"use client";

import { useEffect, useState } from "react";

interface TerminalLoaderProps {
  message?: string;
  messages?: string[];
  className?: string;
  color?: "terminal" | "amber" | "redacted";
}

export default function TerminalLoader({
  message = "LOADING...",
  messages,
  className = "",
  color = "terminal",
}: TerminalLoaderProps) {
  const [displayed, setDisplayed] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const colorClass = {
    terminal: "text-terminal",
    amber: "text-amber",
    redacted: "text-redacted",
  }[color];

  const colorStyle = {
    terminal: "var(--terminal)",
    amber: "var(--amber)",
    redacted: "var(--redacted)",
  }[color];

  const allMessages = messages || [message];
  const currentMsg = allMessages[msgIndex] || "";

  useEffect(() => {
    if (charIndex < currentMsg.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + currentMsg[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 35 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else if (messages && messages.length > 1) {
      // Move to next message after a pause
      const timeout = setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % messages.length);
        setCharIndex(0);
        setDisplayed("");
      }, 1800);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentMsg, messages, msgIndex]);

  return (
    <div
      className={`font-mono flex items-center gap-2 ${colorClass} ${className}`}
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
      role="status"
      aria-live="polite"
    >
      <span className="text-xs opacity-60">&gt;_</span>
      <span>{displayed}</span>
      <span
        className="inline-block w-2 h-4"
        style={{
          background: colorStyle,
          animation: "cursorBlink 1s step-end infinite",
          boxShadow: `0 0 6px ${colorStyle}`,
        }}
      />
    </div>
  );
}
