"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, Math.random() * 5000 + 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 border-b border-terminal/20"
      style={{
        background: "rgba(5, 5, 8, 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 20px rgba(0, 255, 157, 0.05)",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-12">
        {/* Left: Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="PROJECT LOOKING GLASS - Home"
        >
          {/* Signal icon */}
          <div className="flex items-center gap-[2px] opacity-70 group-hover:opacity-100 transition-opacity">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-terminal"
                style={{
                  width: "2px",
                  height: `${4 + i * 4}px`,
                  opacity: 0.6 + i * 0.13,
                  boxShadow: "0 0 4px var(--terminal)",
                }}
              />
            ))}
          </div>
          <span
            className={`text-terminal text-xs md:text-sm font-mono tracking-widest transition-all ${
              glitch ? "glitch-animate" : ""
            }`}
            style={{ textShadow: "0 0 8px rgba(0, 255, 157, 0.6)" }}
          >
            PROJECT{" "}
            <span className="text-amber">LOOKING GLASS</span>
            <span className="text-terminal/40 mx-1">//</span>
            <span className="hidden sm:inline text-terminal/70">
              DECLASSIFIED FILES
            </span>
          </span>
        </Link>

        {/* Right: nav links */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/files"
            className="text-terminal/60 hover:text-terminal text-xs tracking-widest transition-colors hidden sm:block"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            [ FILES ]
          </Link>

        </div>
      </div>

      {/* Thin glow line at bottom */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,157,0.3), transparent)",
        }}
      />
    </nav>
  );
}
