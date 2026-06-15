"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { RELEASE_DATE_LABELS } from "@/lib/format";
import type { FileRecord } from "@/types";

interface ImageViewerProps {
  url: string | null;
  file: FileRecord;
}

export default function ImageViewer({ url, file }: ImageViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [error, setError] = useState(!url);

  const metadata = [
    { label: "LOCATION", value: "UNKNOWN // COORDINATES REDACTED" },
    { label: "SOURCE", value: "DECLASSIFIED DOD RECORDS" },
    { label: "DATE", value: file.lastModified ? new Date(file.lastModified).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "UNKNOWN" },
    { label: "RELEASE", value: RELEASE_DATE_LABELS[file.releaseDate] ?? file.releaseDate.toUpperCase() },
    { label: "CLASSIFICATION", value: "FORMERLY TOP SECRET // NOW DECLASSIFIED" },
    { label: "CASE REF", value: `UAP-${file.id.slice(-8).toUpperCase()}` },
  ];

  return (
    <div className="w-full">
      {/* Image container */}
      <div
        className="relative flex items-center justify-center w-full overflow-hidden cursor-zoom-in"
        style={{
          background: "rgba(5,5,8,0.8)",
          border: "1px solid rgba(0,255,157,0.1)",
          minHeight: "400px",
          maxHeight: "65vh",
        }}
        onClick={() => !error && setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!error) setLightboxOpen(true); } }}
        aria-label="Click to open full-screen lightbox"
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
          }}
        />

        {error ? (
          <div
            className="flex flex-col items-center gap-3"
            style={{
              color: "rgba(0,255,157,0.4)",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            <div style={{ fontSize: "3rem", opacity: 0.3 }}>▣</div>
            <p className="text-sm tracking-widest">IMAGE UNAVAILABLE</p>
            <p className="text-xs opacity-50">{"// PRESIGNED URL MAY HAVE EXPIRED"}</p>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
              style={{
                filter: "grayscale(10%) contrast(1.05)",
                boxShadow: "0 0 40px rgba(0,0,0,0.8)",
              }}
              onError={() => setError(true)}
            />



            {/* Zoom hint */}
            <div
              className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2 py-1"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(0,255,157,0.2)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.72rem",
                color: "rgba(0,255,157,0.85)",
                letterSpacing: "0.1em",
              }}
            >
              ⊕ CLICK TO ENLARGE
            </div>
          </>
        )}
      </div>

      {/* Metadata panel */}
      <div
        className="w-full mt-4 p-4"
        style={{
          background: "rgba(5,5,8,0.8)",
          border: "1px solid rgba(0,255,157,0.1)",
        }}
      >
        <div
          className="text-xs mb-3 opacity-75 tracking-widest"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "var(--terminal)",
            borderBottom: "1px solid rgba(0,255,157,0.1)",
            paddingBottom: "8px",
            letterSpacing: "0.2em",
          }}
        >
          {"// IMAGE METADATA // UNCLASSIFIED"}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {metadata.map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.75rem",
                  color: "rgba(0,255,157,0.65)",
                  minWidth: "110px",
                  letterSpacing: "0.1em",
                }}
              >
                {label}:
              </span>
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.75rem",
                  color: "rgba(0,255,157,0.9)",
                  letterSpacing: "0.05em",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: url ?? "", alt: file.name }]}
          styles={{
            container: {
              backgroundColor: "rgba(5,5,8,0.97)",
            },
          }}
        />
      )}
    </div>
  );
}
