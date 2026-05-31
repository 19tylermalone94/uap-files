"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FileGrid from "@/components/browser/FileGrid";
import FilterBar from "@/components/browser/FilterBar";
import TerminalLoader from "@/components/ui/TerminalLoader";
import { formatSize } from "@/lib/format";
import type { FileRecord } from "@/types";

const RELEASE_TIMESTAMPS: Record<string, number> = {
  "may-8": new Date("2026-05-08").getTime(),
  "may-22": new Date("2026-05-22").getTime(),
};
const NEW_BADGE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const RELEASE_DATE_LABELS: Record<string, string> = {
  "may-8": "MAY 08 2025",
  "may-22": "MAY 22 2025",
};

interface Filters {
  types: Set<"pdf" | "video" | "image">;
  dates: Set<"may-8" | "may-22">;
  keyword: string;
}


function ListViewTable({ files }: { files: FileRecord[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div
      style={{
        border: "1px solid rgba(0,255,157,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Table header */}
      <div
        className="grid text-xs px-4 py-2"
        style={{
          gridTemplateColumns: "80px 1fr 70px 80px 110px 100px",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.1em",
          color: "rgba(0,255,157,0.65)",
          borderBottom: "1px solid rgba(0,255,157,0.1)",
          background: "rgba(0,255,157,0.03)",
          gap: "8px",
        }}
      >
        <span>CASE #</span>
        <span>FILE NAME</span>
        <span>TYPE</span>
        <span>SIZE</span>
        <span>DATE</span>
        <span>STATUS</span>
      </div>

      {files.length === 0 && (
        <div
          className="py-12 text-center"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,255,157,0.65)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
          }}
        >
          NO RECORDS FOUND
        </div>
      )}

      {files.map((file, i) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          className="grid cursor-pointer px-4 py-3"
          style={{
            gridTemplateColumns: "80px 1fr 70px 80px 110px 100px",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            borderBottom: "1px solid rgba(0,255,157,0.05)",
            background:
              hoveredId === file.id ? "rgba(0,255,157,0.06)" : "transparent",
            boxShadow:
              hoveredId === file.id
                ? "inset 0 0 20px rgba(0,255,157,0.04)"
                : "none",
            transition: "background 0.15s, box-shadow 0.15s",
            gap: "8px",
            alignItems: "center",
          }}
          onMouseEnter={() => setHoveredId(file.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() =>
            router.push(`/files/${encodeURIComponent(file.id)}`)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            router.push(`/files/${encodeURIComponent(file.id)}`)
          }
          aria-label={`Open ${file.name}`}
        >
          <span
            style={{
              color: "rgba(0,255,157,0.65)",
              fontSize: "0.7rem",
            }}
          >
            #{file.id.slice(-8).toUpperCase()}
          </span>
          <span
            className="truncate"
            style={{
              color:
                file.type === "pdf"
                  ? "var(--paper)"
                  : file.type === "video"
                  ? "var(--amber)"
                  : "var(--terminal)",
            }}
          >
            {file.name}
            {Date.now() - (RELEASE_TIMESTAMPS[file.releaseDate] ?? 0) < NEW_BADGE_TTL_MS && (
              <span
                className="ml-2 px-1"
                style={{
                  background: "var(--stamp-red)",
                  color: "#fff",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  verticalAlign: "middle",
                }}
              >
                NEW
              </span>
            )}
          </span>
          <span
            style={{
              color: "rgba(0,255,157,0.75)",
              fontSize: "0.7rem",
              textTransform: "uppercase",
            }}
          >
            {file.type}
          </span>
          <span style={{ color: "rgba(0,255,157,0.65)", fontSize: "0.7rem" }}>
            {formatSize(file.size)}
          </span>
          <span style={{ color: "rgba(0,255,157,0.65)", fontSize: "0.7rem" }}>
            {RELEASE_DATE_LABELS[file.releaseDate] ?? file.releaseDate.toUpperCase()}
          </span>
          <span
            style={{
              color: "var(--terminal)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textShadow: "0 0 6px rgba(0,255,157,0.4)",
            }}
          >
            DECLASSIFIED
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    types: new Set<"pdf" | "video" | "image">(["pdf", "video", "image"]),
    dates: new Set<"may-8" | "may-22">(["may-8", "may-22"]),
    keyword: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: FileRecord[] = await res.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (!filters.types.has(f.type)) return false;
      if (!filters.dates.has(f.releaseDate)) return false;
      if (
        filters.keyword &&
        !f.name.toLowerCase().includes(filters.keyword.toLowerCase())
      )
        return false;
      return true;
    });
  }, [files, filters]);

  const viewBtnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    padding: "5px 12px",
    border: `1px solid ${active ? "var(--terminal)" : "rgba(0,255,157,0.2)"}`,
    color: active ? "var(--terminal)" : "rgba(0,255,157,0.4)",
    background: active ? "rgba(0,255,157,0.08)" : "transparent",
    cursor: "pointer",
    boxShadow: active ? "0 0 8px rgba(0,255,157,0.2)" : "none",
    transition: "all 0.15s ease",
  });

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(0,30,15,0.3) 0%, transparent 50%), #050508",
        paddingTop: "48px",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Breadcrumb + top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div
            className="flex flex-wrap items-start md:items-center justify-between gap-4 pb-4"
            style={{ borderBottom: "1px solid rgba(0,255,157,0.1)" }}
          >
            {/* Breadcrumb */}
            <div>
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.75rem",
                  color: "rgba(0,255,157,0.65)",
                  letterSpacing: "0.15em",
                  marginBottom: "4px",
                }}
              >
                &gt; LOOKING_GLASS / ALL_FILES
              </div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  color: "var(--terminal)",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  textShadow: "0 0 20px rgba(0,255,157,0.3)",
                }}
              >
                DECLASSIFIED RECORDS
              </h1>
            </div>

            {/* File count readout */}
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{
                border: "1px solid rgba(0,255,157,0.2)",
                background: "rgba(0,255,157,0.04)",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(0,255,157,0.75)",
                  letterSpacing: "0.15em",
                }}
              >
                RECORDS FOUND:
              </span>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "var(--terminal)",
                  letterSpacing: "0.1em",
                  textShadow: "0 0 8px rgba(0,255,157,0.5)",
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                {loading ? "---" : filtered.length.toString().padStart(3, "0")}
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(0,255,157,0.6)",
                  letterSpacing: "0.1em",
                }}
              >
                / {files.length}
              </span>
            </div>
          </div>

          {/* View toggle + sidebar toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="mr-3"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  padding: "4px 10px",
                  border: "1px solid rgba(0,255,157,0.25)",
                  color: "rgba(0,255,157,0.65)",
                  background: "transparent",
                  cursor: "pointer",
                }}
                aria-label="Toggle filter sidebar"
              >
                {sidebarOpen ? "[ HIDE FILTER ]" : "[ SHOW FILTER ]"}
              </button>

              <button
                style={viewBtnStyle(view === "grid")}
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
              >
                ⊞ GRID
              </button>
              <button
                style={viewBtnStyle(view === "list")}
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
              >
                ≡ LIST
              </button>
            </div>

            {/* Mini stats */}
            <div
              className="hidden md:flex items-center gap-4"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.72rem",
                color: "rgba(0,255,157,0.6)",
                letterSpacing: "0.08em",
              }}
            >
              <span>
                PDF:{" "}
                <span style={{ color: "var(--paper)" }}>
                  {files.filter((f) => f.type === "pdf").length}
                </span>
              </span>
              <span>
                VIDEO:{" "}
                <span style={{ color: "var(--amber)" }}>
                  {files.filter((f) => f.type === "video").length}
                </span>
              </span>
              <span>
                IMAGE:{" "}
                <span style={{ color: "var(--terminal)" }}>
                  {files.filter((f) => f.type === "image").length}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main layout: sidebar + content */}
        <div className="flex gap-5">
          {/* Filter sidebar */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-56 shrink-0 hidden md:block"
            >
              <FilterBar onFiltersChange={setFilters} />
            </motion.div>
          )}

          {/* Content area */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter bar (above grid) */}
            <div className="md:hidden mb-4">
              <FilterBar onFiltersChange={setFilters} />
            </div>

            {loading && (
              <div className="py-24 flex justify-center">
                <TerminalLoader
                  messages={[
                    "ACCESSING CLASSIFIED ARCHIVES...",
                    "DECRYPTING FILE HEADERS...",
                    "VERIFYING CLEARANCE LEVEL...",
                    "LOADING RECORDS...",
                  ]}
                />
              </div>
            )}

            {error && (
              <div
                className="py-24 text-center"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: "var(--redacted)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                }}
              >
                <p className="mb-2">CONNECTION ERROR</p>
                <p style={{ fontSize: "0.72rem", opacity: 0.8 }}>{error}</p>
              </div>
            )}

            {!loading && !error && view === "grid" && (
              <FileGrid files={filtered} />
            )}

            {!loading && !error && view === "list" && (
              <ListViewTable files={filtered} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
