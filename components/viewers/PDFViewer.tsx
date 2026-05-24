"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PDFViewerProps {
  url: string;
  fileName?: string;
}

export default function PDFViewer({ url, fileName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setLoading(false);
    },
    []
  );

  const onDocumentLoadError = useCallback((err: Error) => {
    setError(err.message);
    setLoading(false);
  }, []);

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(2.5, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));

  const btnStyle = {
    fontFamily: "'Share Tech Mono', monospace",
    border: "1px solid rgba(0,255,157,0.3)",
    color: "var(--terminal)",
    background: "rgba(0,255,157,0.05)",
    padding: "4px 12px",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
  };

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-4"
        style={{ color: "var(--redacted)", fontFamily: "'Share Tech Mono', monospace" }}
      >
        <div style={{ fontSize: "2rem", opacity: 0.5 }}>⚠</div>
        <p className="text-sm tracking-widest">DOCUMENT LOAD ERROR</p>
        <p className="text-xs opacity-80">{error}</p>
        {error.toLowerCase().includes("expired") && (
          <p className="text-xs opacity-65">// PRESIGNED URL MAY HAVE EXPIRED</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Controls */}
      <div
        className="flex flex-wrap items-center gap-3 w-full px-4 py-3"
        style={{
          background: "rgba(5,5,8,0.9)",
          border: "1px solid rgba(0,255,157,0.15)",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            style={{ ...btnStyle, opacity: pageNumber <= 1 ? 0.3 : 1 }}
            onMouseEnter={(e) => {
              if (pageNumber > 1) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--terminal)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,157,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,157,0.3)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,157,0.05)";
            }}
          >
            &lt;&lt; PREV
          </button>

          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(0,255,157,0.7)",
              fontSize: "0.75rem",
              padding: "4px 12px",
              border: "1px solid rgba(0,255,157,0.2)",
              background: "rgba(0,255,157,0.03)",
              letterSpacing: "0.1em",
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            PAGE {pageNumber} / {numPages || "?"}
          </span>

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            style={{ ...btnStyle, opacity: pageNumber >= numPages ? 0.3 : 1 }}
            onMouseEnter={(e) => {
              if (pageNumber < numPages) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--terminal)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,157,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,157,0.3)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,157,0.05)";
            }}
          >
            NEXT &gt;&gt;
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            style={{ ...btnStyle, opacity: scale <= 0.5 ? 0.3 : 1 }}
            onMouseEnter={(e) => {
              if (scale > 0.5) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--terminal)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,157,0.3)";
            }}
          >
            ZOOM −
          </button>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(0,255,157,0.75)",
              fontSize: "0.75rem",
              minWidth: "50px",
              textAlign: "center",
            }}
          >
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.5}
            style={{ ...btnStyle, opacity: scale >= 2.5 ? 0.3 : 1 }}
            onMouseEnter={(e) => {
              if (scale < 2.5) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--terminal)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,157,0.3)";
            }}
          >
            ZOOM +
          </button>
        </div>
      </div>

      {/* PDF Document area */}
      <div
        className="w-full flex justify-center overflow-auto"
        style={{
          background: "rgba(5,5,8,0.5)",
          minHeight: "60vh",
          maxHeight: "80vh",
          position: "relative",
        }}
      >
        {loading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ color: "var(--terminal)", fontFamily: "'Share Tech Mono', monospace" }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{
                border: "2px solid rgba(0,255,157,0.2)",
                borderTopColor: "var(--terminal)",
                animation: "slowRotate 1s linear infinite",
              }}
            />
            <p className="text-xs tracking-widest animate-pulse">DECRYPTING DOCUMENT...</p>
          </div>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            loading={null}
          />
        </Document>
      </div>

      {/* File info footer */}
      {fileName && (
        <div
          className="w-full text-center"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.75rem",
            color: "rgba(0,255,157,0.6)",
            letterSpacing: "0.1em",
          }}
        >
          // {fileName} — PAGE {pageNumber} OF {numPages} — ZOOM {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}
