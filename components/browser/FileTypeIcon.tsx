"use client";

interface FileTypeIconProps {
  type: "pdf" | "video" | "image";
  size?: number;
  className?: string;
}

export default function FileTypeIcon({
  type,
  size = 24,
  className = "",
}: FileTypeIconProps) {
  if (type === "pdf") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="PDF file"
      >
        <filter id="pdf-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <g filter="url(#pdf-glow)">
          <path
            d="M4 2h10l6 6v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
            stroke="var(--paper)"
            strokeWidth="1.5"
            fill="rgba(200, 184, 154, 0.1)"
          />
          <path
            d="M14 2v6h6"
            stroke="var(--paper)"
            strokeWidth="1.5"
            fill="none"
          />
          <text
            x="12"
            y="18"
            textAnchor="middle"
            fill="var(--paper)"
            fontSize="5"
            fontFamily="monospace"
            fontWeight="bold"
            style={{ textShadow: "0 0 4px var(--paper)" }}
          >
            PDF
          </text>
          <line x1="6" y1="13" x2="14" y2="13" stroke="var(--paper)" strokeWidth="0.75" opacity="0.5" />
          <line x1="6" y1="11" x2="18" y2="11" stroke="var(--paper)" strokeWidth="0.75" opacity="0.5" />
        </g>
      </svg>
    );
  }

  if (type === "video") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Video file"
      >
        <filter id="video-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <g filter="url(#video-glow)">
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="2"
            stroke="var(--amber)"
            strokeWidth="1.5"
            fill="rgba(245, 166, 35, 0.08)"
          />
          <polygon
            points="10,9 10,15 16,12"
            fill="var(--amber)"
            opacity="0.9"
            style={{ filter: "drop-shadow(0 0 3px var(--amber))" }}
          />
          <line x1="2" y1="8" x2="22" y2="8" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3" />
          <line x1="2" y1="16" x2="22" y2="16" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3" />
        </g>
      </svg>
    );
  }

  // image
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Image file"
    >
      <filter id="img-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <g filter="url(#img-glow)">
        <rect
          x="2"
          y="3"
          width="20"
          height="18"
          rx="2"
          stroke="var(--terminal)"
          strokeWidth="1.5"
          fill="rgba(0, 255, 157, 0.05)"
        />
        <circle cx="8" cy="8.5" r="2" fill="var(--amber)" opacity="0.7" />
        <polyline
          points="2,17 8,11 12,15 16,10 22,17"
          stroke="var(--terminal)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
          style={{ filter: "drop-shadow(0 0 2px var(--terminal))" }}
        />
      </g>
    </svg>
  );
}
