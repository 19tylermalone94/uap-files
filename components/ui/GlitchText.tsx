"use client";

import React, { useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  intensity?: "low" | "medium" | "high";
}

export default function GlitchText({
  text,
  className = "",
  style,
  as: Tag = "h1",
  intensity = "medium",
}: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);

  const intervalMs =
    intensity === "low" ? 8000 : intensity === "medium" ? 4000 : 2000;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const triggerGlitch = () => {
      el.classList.add("glitching");
      timeoutId = setTimeout(() => {
        el.classList.remove("glitching");
        scheduleNext();
      }, 300);
    };

    const scheduleNext = () => {
      const delay = intervalMs + Math.random() * intervalMs;
      timeoutId = setTimeout(triggerGlitch, delay);
    };

    scheduleNext();
    return () => {
      clearTimeout(timeoutId);
      el.classList.remove("glitching");
    };
  }, [intervalMs]);

  return (
    <>
      <style>{`
        .glitch-wrap {
          position: relative;
          display: inline-block;
        }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        .glitch-wrap::before {
          color: var(--redacted);
          clip-path: inset(0 0 100% 0);
        }
        .glitch-wrap::after {
          color: var(--amber);
          clip-path: inset(100% 0 0 0);
        }
        .glitch-wrap.glitching::before {
          opacity: 0.8;
          animation: glitch-before 0.3s steps(2) forwards;
        }
        .glitch-wrap.glitching::after {
          opacity: 0.8;
          animation: glitch-after 0.3s steps(2) forwards;
        }
        @keyframes glitch-before {
          0%   { clip-path: inset(40% 0 50% 0); transform: translate(-3px, 1px); }
          25%  { clip-path: inset(10% 0 80% 0); transform: translate(3px, -1px); }
          50%  { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 2px); }
          75%  { clip-path: inset(80% 0 5%  0); transform: translate(2px, -2px); }
          100% { clip-path: inset(0 0 100% 0);  transform: translate(0); opacity: 0; }
        }
        @keyframes glitch-after {
          0%   { clip-path: inset(70% 0 10% 0); transform: translate(3px, -1px); }
          25%  { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 1px); }
          50%  { clip-path: inset(5%  0 85% 0); transform: translate(2px, 2px); }
          75%  { clip-path: inset(50% 0 30% 0); transform: translate(-2px, -1px); }
          100% { clip-path: inset(100% 0 0 0);  transform: translate(0); opacity: 0; }
        }
      `}</style>
      <Tag
        ref={ref as React.RefObject<HTMLHeadingElement>}
        className={`glitch-wrap ${className}`}
        data-text={text}
        style={style}
      >
        {text}
      </Tag>
    </>
  );
}
