"use client";

import { useEffect, useRef, useState } from "react";

interface RedactedBarProps {
  width?: string;
  animate?: boolean;
  delay?: number;
  className?: string;
}

export default function RedactedBar({
  width = "100%",
  animate = false,
  delay = 0,
  className = "",
}: RedactedBarProps) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate, delay]);

  return (
    <div
      ref={ref}
      className={`relative inline-block align-middle ${className}`}
      style={{ width, height: "1em" }}
    >
      {/* Black redaction bar */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      />

      {/* Redaction reveal animation */}
      {animate && (
        <div
          className="absolute inset-0 bg-deep-space"
          style={{
            transformOrigin: "right",
            transform: revealed ? "scaleX(0)" : "scaleX(1)",
            transition: "transform 0.6s ease-in-out",
            boxShadow: revealed ? "none" : "2px 0 0 rgba(0, 255, 157, 0.5)",
          }}
        />
      )}

      {/* Slight texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)",
        }}
      />
    </div>
  );
}
