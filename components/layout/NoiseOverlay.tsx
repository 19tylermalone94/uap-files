"use client";

export default function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 0.03 }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noise-filter)"
          opacity="1"
        />
      </svg>
    </div>
  );
}
