"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import StampBadge from "@/components/ui/StampBadge";
import TerminalLoader from "@/components/ui/TerminalLoader";
import VideoViewer from "@/components/viewers/VideoViewer";
import ImageViewer from "@/components/viewers/ImageViewer";
import type { FileRecord } from "@/types";

// Dynamic import for PDFViewer to avoid SSR issues with pdfjs
const PDFViewer = dynamic(() => import("@/components/viewers/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="py-24 flex justify-center">
      <TerminalLoader message="LOADING PDF ENGINE..." />
    </div>
  ),
});

interface FileData {
  url: string | null;
  metadata: FileRecord;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileViewerPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [data, setData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/files/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: FileData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id]);

  const meta = data?.metadata;
  const url = data?.url;

  const typeColor =
    meta?.type === "pdf"
      ? "var(--paper)"
      : meta?.type === "video"
      ? "var(--amber)"
      : "var(--terminal)";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 80% 10%, rgba(0,20,10,0.3) 0%, transparent 50%), #050508",
        paddingTop: "48px",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back link */}
        <div className="mb-5">
          <Link
            href="/files"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(0,255,157,0.5)",
              letterSpacing: "0.15em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--terminal)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,255,157,0.5)")
            }
          >
            &lt; BACK TO FILES
          </Link>
        </div>

        {loading && (
          <div className="py-32 flex justify-center">
            <TerminalLoader
              messages={[
                "RETRIEVING FILE METADATA...",
                "GENERATING SECURE ACCESS TOKEN...",
                "DECRYPTING HEADERS...",
              ]}
            />
          </div>
        )}

        {error && (
          <div
            className="py-32 text-center"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "var(--redacted)",
            }}
          >
            <p className="text-lg tracking-widest mb-2">FILE ACCESS DENIED</p>
            <p style={{ fontSize: "0.7rem", opacity: 0.5 }}>{error}</p>
          </div>
        )}

        {!loading && !error && meta && (
          <>
            {/* Header section */}
            <div
              className="mb-6 pb-5"
              style={{ borderBottom: "1px solid rgba(0,255,157,0.1)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Breadcrumb */}
                  <div
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(0,255,157,0.35)",
                      letterSpacing: "0.12em",
                      marginBottom: "8px",
                    }}
                  >
                    &gt; LOOKING_GLASS / ALL_FILES /{" "}
                    <span style={{ color: "rgba(0,255,157,0.6)" }}>
                      {meta.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Filename */}
                  <h1
                    className="break-all leading-tight mb-3"
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "clamp(0.85rem, 2.5vw, 1.2rem)",
                      color: typeColor,
                      letterSpacing: "0.04em",
                      textShadow: `0 0 12px ${typeColor}60`,
                    }}
                  >
                    {meta.name}
                  </h1>

                  {/* Metadata row */}
                  <div
                    className="flex flex-wrap gap-3 items-center"
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    <MetaBadge
                      label="TYPE"
                      value={meta.type.toUpperCase()}
                      color={typeColor}
                    />
                    <MetaBadge label="SIZE" value={formatSize(meta.size)} />
                    <MetaBadge
                      label="RELEASE"
                      value={
                        meta.releaseDate === "may-8" ? "MAY 8, 2025" : "MAY 22, 2025"
                      }
                    />
                    <MetaBadge
                      label="CASE #"
                      value={meta.id.slice(-8).toUpperCase()}
                    />
                    {meta.pageCount && (
                      <MetaBadge label="PAGES" value={String(meta.pageCount)} />
                    )}
                    {meta.duration && (
                      <MetaBadge
                        label="DURATION"
                        value={`${Math.floor(meta.duration / 60)}:${(
                          meta.duration % 60
                        )
                          .toString()
                          .padStart(2, "0")}`}
                      />
                    )}
                  </div>
                </div>

                {/* DECLASSIFIED stamp */}
                <div className="shrink-0 mt-2">
                  <StampBadge label="DECLASSIFIED" size="md" rotation={-8} />
                </div>
              </div>
            </div>

            {/* Viewer */}
            <div>
              {!url && meta.type !== "image" && (
                <div
                  className="py-16 text-center border"
                  style={{
                    borderColor: "rgba(0,255,157,0.1)",
                    fontFamily: "'Share Tech Mono', monospace",
                    color: "rgba(0,255,157,0.4)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.12em",
                  }}
                >
                  <div className="mb-3">[ MOCK MODE ]</div>
                  <p style={{ fontSize: "0.65rem", opacity: 0.6 }}>
                    // S3 NOT CONFIGURED — NO PRESIGNED URL AVAILABLE
                  </p>
                  <p style={{ fontSize: "0.65rem", opacity: 0.4, marginTop: "4px" }}>
                    // SET S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY IN .env.local
                  </p>

                  {/* Show document stub */}
                  <div
                    className="mt-8 mx-auto max-w-md p-6"
                    style={{
                      background: meta.type === "pdf" ? "var(--paper)" : "rgba(10,10,20,0.8)",
                      border: `1px solid ${meta.type === "video" ? "rgba(245,166,35,0.3)" : "rgba(0,255,157,0.15)"}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily:
                          meta.type === "pdf"
                            ? "'Special Elite', cursive"
                            : "'Share Tech Mono', monospace",
                        color: meta.type === "pdf" ? "#2a1f0e" : "rgba(0,255,157,0.5)",
                        fontSize: "0.75rem",
                        textAlign: "left",
                      }}
                    >
                      {meta.type === "pdf" && (
                        <>
                          <p className="font-bold text-center mb-4" style={{ letterSpacing: "0.2em" }}>
                            DEPARTMENT OF DEFENSE
                          </p>
                          <p className="text-center mb-4" style={{ opacity: 0.5, fontSize: "0.65rem" }}>
                            OFFICE OF THE UNDER SECRETARY OF DEFENSE
                          </p>
                          <p className="mb-2">
                            SUBJECT: {meta.name.replace(".pdf", "").replace(/-/g, " ")}
                          </p>
                          <div className="space-y-2 mt-4" style={{ opacity: 0.3 }}>
                            {["INCIDENT CLASSIFICATION:", "DATE/TIME GROUP:", "LOCATION:", "REPORTING UNIT:", "DESCRIPTION:"].map((l) => (
                              <p key={l}>{l} {"█".repeat(20)}</p>
                            ))}
                          </div>
                        </>
                      )}
                      {meta.type === "video" && (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                          <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>▶</div>
                          <p style={{ letterSpacing: "0.15em" }}>VIDEO UNAVAILABLE IN DEMO MODE</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {url && meta.type === "pdf" && (
                <PDFViewer url={url} fileName={meta.name} />
              )}

              {url && meta.type === "video" && (
                <VideoViewer url={url} fileName={meta.name} />
              )}

              {meta.type === "image" && (
                <ImageViewer url={url || "https://placehold.co/800x600/050508/00ff9d?text=IMAGE+UNAVAILABLE"} file={meta} />
              )}
            </div>

            {/* Footer metadata */}
            <div
              className="mt-6 pt-4 flex flex-wrap gap-4"
              style={{
                borderTop: "1px solid rgba(0,255,157,0.08)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                color: "rgba(0,255,157,0.25)",
                letterSpacing: "0.1em",
              }}
            >
              <span>
                LAST MODIFIED:{" "}
                {meta.lastModified
                  ? new Date(meta.lastModified).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "UNKNOWN"}
              </span>
              <span>KEY: {meta.key}</span>
              <span>FOIA COMPLIANT: YES</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetaBadge({
  label,
  value,
  color = "rgba(0,255,157,0.6)",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1"
      style={{
        border: "1px solid rgba(0,255,157,0.12)",
        background: "rgba(0,255,157,0.03)",
      }}
    >
      <span style={{ color: "rgba(0,255,157,0.35)", fontSize: "0.55rem" }}>
        {label}:
      </span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}
