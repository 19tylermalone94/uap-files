"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cases } from "@/lib/cases";
import { mockFiles } from "@/lib/mock-files";
import type { FileRecord } from "@/types";

const TYPE_COLOR: Record<string, string> = {
  pdf: "var(--paper)",
  video: "var(--amber)",
  image: "var(--terminal)",
};

const TYPE_LABEL: Record<string, string> = {
  pdf: "PDF",
  video: "VID",
  image: "IMG",
};

function FileChip({ file }: { file: FileRecord }) {
  const color = TYPE_COLOR[file.type];
  return (
    <Link
      href={`/files/${encodeURIComponent(file.id)}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        border: `1px solid ${color}30`,
        background: `${color}08`,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        color: `${color}cc`,
        textDecoration: "none",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = `${color}18`;
        (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}60`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = `${color}08`;
        (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}30`;
      }}
    >
      <span
        style={{
          fontSize: "0.55rem",
          padding: "1px 4px",
          border: `1px solid ${color}50`,
          color,
          letterSpacing: "0.1em",
        }}
      >
        {TYPE_LABEL[file.type]}
      </span>
      <span className="truncate" style={{ maxWidth: "240px" }}>
        {file.name.toUpperCase()}
      </span>
    </Link>
  );
}

export default function CasesPage() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fileMap: Record<string, FileRecord> = Object.fromEntries(
    mockFiles.map((f) => [f.id, f])
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(0,10,20,0.4) 0%, transparent 60%), #050508",
        paddingTop: "48px",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.72rem",
            color: "rgba(0,255,157,0.55)",
            letterSpacing: "0.12em",
            marginBottom: "20px",
          }}
        >
          &gt; LOOKING_GLASS /{" "}
          <span style={{ color: "rgba(0,255,157,0.9)" }}>CASE_DOSSIERS</span>
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "var(--terminal)",
              letterSpacing: "0.12em",
              textShadow: "0 0 20px rgba(0,255,157,0.3)",
              marginBottom: "6px",
            }}
          >
            CASE DOSSIERS
          </h1>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(0,255,157,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {"// "}{cases.length} INVESTIGATION CLUSTERS — CROSS-REFERENCED EVIDENCE
          </p>
        </div>

        {/* Case cards */}
        <div className="flex flex-col gap-6">
          {cases.map((c, idx) => {
            const files = c.fileIds
              .map((id) => fileMap[id])
              .filter(Boolean) as FileRecord[];

            return (
              <div
                key={c.id}
                style={{
                  border: "1px solid rgba(0,255,157,0.12)",
                  background: "rgba(0,255,157,0.02)",
                  padding: "20px 24px",
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.35s ease ${idx * 0.07}s, transform 0.35s ease ${idx * 0.07}s`,
                }}
              >
                {/* Case header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.6rem",
                        color: "rgba(0,255,157,0.45)",
                        letterSpacing: "0.15em",
                        marginBottom: "4px",
                      }}
                    >
                      DOSSIER {String(idx + 1).padStart(2, "0")} /{" "}
                      {c.id.toUpperCase()}
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.35rem",
                        color: "var(--terminal)",
                        letterSpacing: "0.1em",
                        textShadow: "0 0 10px rgba(0,255,157,0.2)",
                      }}
                    >
                      {c.title}
                    </h2>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(0,255,157,0.35)",
                      letterSpacing: "0.12em",
                      whiteSpace: "nowrap",
                      paddingTop: "4px",
                    }}
                  >
                    {files.length} FILE{files.length !== 1 ? "S" : ""}
                  </div>
                </div>

                {/* Summary */}
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.72rem",
                    color: "rgba(0,255,157,0.65)",
                    letterSpacing: "0.04em",
                    lineHeight: "1.7",
                  }}
                >
                  {c.summary}
                </p>

                {/* Divider */}
                <div
                  className="mb-4"
                  style={{ borderTop: "1px solid rgba(0,255,157,0.07)" }}
                />

                {/* File chips */}
                <div className="flex flex-wrap gap-2">
                  {files.map((f) => (
                    <FileChip key={f.id} file={f} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-10">
          <Link
            href="/files"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(0,255,157,0.6)",
              letterSpacing: "0.15em",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--terminal)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(0,255,157,0.6)")
            }
          >
            &lt; BACK TO FILE BROWSER
          </Link>
        </div>
      </div>
    </div>
  );
}
