"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FileTypeIcon from "./FileTypeIcon";
import { formatSize, formatDuration } from "@/lib/format";
import type { FileRecord } from "@/types";

interface FileCardProps {
  file: FileRecord;
  index?: number;
}


export default function FileCard({ file, index = 0 }: FileCardProps) {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const [accessing, setAccessing] = useState(false);
  const accessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (accessTimerRef.current !== null) clearTimeout(accessTimerRef.current);
    };
  }, []);

  const handleClick = () => {
    setAccessing(true);
    accessTimerRef.current = setTimeout(() => {
      router.push(`/files/${encodeURIComponent(file.id)}`);
    }, 300);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: index * 0.05, ease: "easeOut" },
    },
  };

  if (file.type === "pdf") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative cursor-pointer dog-ear"
        style={{
          backgroundColor: "var(--paper)",
          transform: hovering ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovering
            ? "0 8px 32px rgba(200,184,154,0.3), 0 0 12px rgba(0,255,157,0.15)"
            : "0 2px 8px rgba(0,0,0,0.5)",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
        aria-label={`Open ${file.name}`}
      >
        {/* CASE # corner badge */}
        <div
          className="absolute top-2 left-2 text-xs"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,0,0,0.6)",
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
          }}
        >
          CASE #{file.id.slice(-8).toUpperCase()}
        </div>

        {/* Paper content */}
        <div className="p-4 pt-7">
          {/* Header lines (fake ruling) */}
          <div className="mb-3 space-y-1">
            {[100, 80, 60].map((w, i) => (
              <div
                key={i}
                className="h-px"
                style={{ width: `${w}%`, background: "rgba(0,0,0,0.12)" }}
              />
            ))}
          </div>

          <FileTypeIcon type="pdf" size={20} className="mb-2 opacity-60" />

          <p
            className="text-xs font-bold leading-tight mb-2 line-clamp-3"
            style={{
              fontFamily: "'Special Elite', cursive",
              color: "#2a1f0e",
              letterSpacing: "0.02em",
            }}
          >
            {file.name}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span
              className="text-xs"
              style={{ color: "rgba(0,0,0,0.6)", fontFamily: "monospace", fontSize: "0.7rem" }}
            >
              {formatSize(file.size)}
            </span>
            {file.pageCount && (
              <span
                className="text-xs px-1 py-0.5"
                style={{
                  background: "rgba(0,0,0,0.1)",
                  color: "rgba(0,0,0,0.65)",
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                }}
              >
                {file.pageCount} PG
              </span>
            )}
          </div>
        </div>

        {/* Accessing overlay */}
        {accessing && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", color: "var(--terminal)", fontFamily: "monospace", fontSize: "0.7rem" }}
          >
            ACCESSING...
          </div>
        )}

        {/* Hover redaction sweep */}
        {hovering && (
          <div
            className="absolute left-0 right-0"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              height: "2px",
              background: "var(--terminal)",
              opacity: 0.4,
              boxShadow: "0 0 8px var(--terminal)",
              animation: "none",
            }}
          />
        )}
      </motion.div>
    );
  }

  if (file.type === "video") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative cursor-pointer overflow-hidden"
        style={{
          background: "rgba(10,10,20,0.95)",
          border: `1px solid ${hovering ? "var(--amber)" : "rgba(245,166,35,0.2)"}`,
          transform: hovering ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          boxShadow: hovering
            ? "0 8px 32px rgba(245,166,35,0.2), 0 0 12px rgba(245,166,35,0.15)"
            : "0 2px 8px rgba(0,0,0,0.6)",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
        aria-label={`Open ${file.name}`}
      >
        {/* Case # */}
        <div
          className="absolute top-2 left-2 z-10"
          style={{ fontFamily: "monospace", color: "rgba(245,166,35,0.8)", fontSize: "0.7rem", letterSpacing: "0.05em" }}
        >
          CASE #{file.id.slice(-8).toUpperCase()}
        </div>

        {/* Video thumbnail area */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: "120px", background: "rgba(5,5,8,0.8)" }}
        >
          {/* Scanlines over thumbnail */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
            }}
          />
          {/* Play button */}
          <div
            className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full"
            style={{
              border: `2px solid var(--amber)`,
              boxShadow: hovering
                ? "0 0 20px var(--amber), 0 0 40px rgba(245,166,35,0.3)"
                : "0 0 8px rgba(245,166,35,0.4)",
              background: "rgba(245,166,35,0.1)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--amber)">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          {/* Corner scan lines decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {[20, 40, 60, 80].map((top) => (
              <div
                key={top}
                className="absolute w-full h-px"
                style={{ top: `${top}%`, background: "var(--amber)" }}
              />
            ))}
          </div>
        </div>

        <div className="p-3">
          <FileTypeIcon type="video" size={16} className="mb-1 opacity-70" />
          <p
            className="text-xs leading-tight mb-2 line-clamp-2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "var(--amber)",
              letterSpacing: "0.02em",
            }}
          >
            {file.name}
          </p>
          <div className="flex items-center justify-between">
            <span style={{ color: "rgba(245,166,35,0.8)", fontFamily: "monospace", fontSize: "0.7rem" }}>
              {formatSize(file.size)}
            </span>
            {file.duration && (
              <span
                className="px-1 py-0.5"
                style={{
                  background: "rgba(245,166,35,0.1)",
                  border: "1px solid rgba(245,166,35,0.3)",
                  color: "var(--amber)",
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                }}
              >
                {formatDuration(file.duration)}
              </span>
            )}
          </div>
        </div>

        {accessing && (
          <div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: "rgba(0,0,0,0.7)", color: "var(--amber)", fontFamily: "monospace", fontSize: "0.7rem" }}
          >
            ACCESSING...
          </div>
        )}
      </motion.div>
    );
  }

  // image type
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative cursor-pointer overflow-hidden"
      style={{
        background: "rgba(5,5,8,0.95)",
        border: `1px solid ${hovering ? "var(--terminal)" : "rgba(0,255,157,0.15)"}`,
        transform: hovering ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        boxShadow: hovering
          ? "0 8px 32px rgba(0,255,157,0.15), 0 0 12px rgba(0,255,157,0.1)"
          : "0 2px 8px rgba(0,0,0,0.6)",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      aria-label={`Open ${file.name}`}
    >
      {/* Case # */}
      <div
        className="absolute top-2 left-2 z-10"
        style={{ fontFamily: "monospace", color: "rgba(0,255,157,0.8)", fontSize: "0.7rem", letterSpacing: "0.05em" }}
      >
        CASE #{file.id.slice(-8).toUpperCase()}
      </div>

      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "120px", background: "rgba(10,10,20,0.9)" }}
      >
        {file.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <FileTypeIcon type="image" size={32} />
            <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "var(--terminal)" }}>
              NO PREVIEW
            </span>
          </div>
        )}

        {/* Scanline overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />

      </div>

      <div className="p-3">
        <FileTypeIcon type="image" size={16} className="mb-1 opacity-70" />
        <p
          className="text-xs leading-tight mb-2 line-clamp-2"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "var(--terminal)",
            letterSpacing: "0.02em",
          }}
        >
          {file.name}
        </p>
        <div className="flex items-center justify-between">
          <span style={{ color: "rgba(0,255,157,0.7)", fontFamily: "monospace", fontSize: "0.7rem" }}>
            {formatSize(file.size)}
          </span>
          <span
            className="px-1 py-0.5"
            style={{
              background: "rgba(0,255,157,0.06)",
              border: "1px solid rgba(0,255,157,0.2)",
              color: "rgba(0,255,157,0.85)",
              fontFamily: "monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
            }}
          >
            IMG
          </span>
        </div>
      </div>

      {accessing && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: "rgba(0,0,0,0.7)", color: "var(--terminal)", fontFamily: "monospace", fontSize: "0.7rem" }}
        >
          ACCESSING...
        </div>
      )}
    </motion.div>
  );
}
