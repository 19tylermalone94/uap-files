"use client";

interface StampBadgeProps {
  label?: "DECLASSIFIED" | "UNCLASSIFIED" | "TOP SECRET" | "RESTRICTED";
  size?: "sm" | "md" | "lg";
  rotation?: number;
  className?: string;
}

export default function StampBadge({
  label = "DECLASSIFIED",
  size = "md",
  rotation = -8,
  className = "",
}: StampBadgeProps) {
  const colors: Record<string, { border: string; text: string; glow: string }> = {
    DECLASSIFIED: {
      border: "var(--stamp-red)",
      text: "var(--stamp-red)",
      glow: "rgba(192, 57, 43, 0.4)",
    },
    UNCLASSIFIED: {
      border: "#2e7d32",
      text: "#2e7d32",
      glow: "rgba(46, 125, 50, 0.4)",
    },
    "TOP SECRET": {
      border: "var(--redacted)",
      text: "var(--redacted)",
      glow: "rgba(255, 60, 60, 0.4)",
    },
    RESTRICTED: {
      border: "var(--amber)",
      text: "var(--amber)",
      glow: "rgba(245, 166, 35, 0.4)",
    },
  };

  const sizes = {
    sm: { fontSize: "0.55rem", padding: "2px 6px", borderWidth: "2px", letterSpacing: "0.15em" },
    md: { fontSize: "0.75rem", padding: "4px 10px", borderWidth: "3px", letterSpacing: "0.2em" },
    lg: { fontSize: "1rem", padding: "6px 14px", borderWidth: "3px", letterSpacing: "0.25em" },
  };

  const { border, text, glow } = colors[label] || colors["DECLASSIFIED"];
  const sizeStyle = sizes[size];

  return (
    <div
      className={`inline-block select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={label}
    >
      <div
        style={{
          border: `${sizeStyle.borderWidth} solid ${border}`,
          color: text,
          fontSize: sizeStyle.fontSize,
          padding: sizeStyle.padding,
          letterSpacing: sizeStyle.letterSpacing,
          fontFamily: "'Special Elite', cursive",
          fontWeight: "bold",
          boxShadow: `0 0 8px ${glow}, inset 0 0 4px ${glow}`,
          opacity: 0.9,
          textShadow: `0 0 6px ${glow}`,
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {label}
        {/* worn texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            opacity: 0.6,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
        {/* horizontal worn lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
