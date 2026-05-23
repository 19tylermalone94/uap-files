"use client";

import { useEffect, useState } from "react";

interface StaticNoiseProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function StaticNoise({
  active,
  onComplete,
  duration = 400,
}: StaticNoiseProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;

    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [active, duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
      style={{
        animation: `staticBurst ${duration}ms steps(4) forwards`,
      }}
    >
      {/* SVG static noise */}
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <filter id="static-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            seed="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0.8
                    0 0 0 0 0.4
                    0 0 0 1 0"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#static-filter)"
          opacity="0.95"
        />
      </svg>

      {/* Horizontal scan lines on static */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
        }}
      />

      {/* Center flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,255,157,0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
