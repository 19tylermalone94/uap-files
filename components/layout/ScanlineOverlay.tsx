"use client";

export default function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-40"
      aria-hidden="true"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        opacity: 1,
      }}
    />
  );
}
