"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface VideoViewerProps {
  url: string;
  fileName?: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoViewer({ url, fileName }: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setError(true));
    }
    setPlaying((p) => !p);
  }, [playing]);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    if (videoRef.current) videoRef.current.muted = !muted;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleEnded = () => setPlaying(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const controlBtn = {
    background: "transparent",
    border: "none",
    color: "var(--amber)",
    cursor: "pointer",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.7rem",
    letterSpacing: "0.05em",
    padding: "4px 8px",
    transition: "color 0.15s, text-shadow 0.15s",
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        background: "#000",
        border: "1px solid rgba(245,166,35,0.2)",
        boxShadow: "0 0 20px rgba(245,166,35,0.05)",
      }}
    >
      {/* RECORDING badge */}
      {playing && (
        <div
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1"
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,60,60,0.4)",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "var(--redacted)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--redacted)",
              boxShadow: "0 0 6px var(--redacted)",
              animation: "dotPulse 1s ease-in-out infinite",
            }}
          />
          RECORDING
        </div>
      )}

      {/* Case # watermark */}
      {fileName && (
        <div
          className="absolute top-3 right-3 z-20"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            color: "rgba(245,166,35,0.3)",
            letterSpacing: "0.08em",
          }}
        >
          {fileName.split("/").pop()}
        </div>
      )}

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* Video element */}
      <video
        ref={videoRef}
        src={url}
        className="w-full"
        style={{ display: "block", maxHeight: "65vh" }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setError(true)}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {error && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
          style={{
            background: "rgba(5,5,8,0.9)",
            color: "var(--redacted)",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          <p className="text-sm tracking-widest">SIGNAL LOST</p>
          <p className="text-xs opacity-50">// VIDEO UNAVAILABLE OR STILL CLASSIFIED</p>
        </div>
      )}

      {/* Custom controls bar */}
      <div
        className="flex flex-col gap-2 px-3 py-2"
        style={{
          background: "rgba(5,5,8,0.95)",
          borderTop: "1px solid rgba(245,166,35,0.15)",
        }}
      >
        {/* Progress / timeline scrubber */}
        <div className="relative flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(245,166,35,0.6)",
              minWidth: "36px",
            }}
          >
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1" style={{ height: "20px" }}>
            {/* Waveform decoration */}
            <div
              className="absolute inset-0 flex items-center gap-px pointer-events-none"
              style={{ overflow: "hidden" }}
            >
              {Array.from({ length: 80 }).map((_, i) => {
                const h = 4 + Math.sin(i * 0.4) * 3 + Math.cos(i * 0.7) * 2;
                const isPlayed = (i / 80) * 100 <= progress;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}px`,
                      background: isPlayed ? "var(--amber)" : "rgba(245,166,35,0.2)",
                      transition: "background 0.05s",
                    }}
                  />
                );
              })}
            </div>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: "100%" }}
              aria-label="Video progress"
            />
          </div>

          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(245,166,35,0.4)",
              minWidth: "36px",
              textAlign: "right",
            }}
          >
            {formatTime(duration)}
          </span>
        </div>

        {/* Button row */}
        <div className="flex items-center gap-1">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            style={{
              ...controlBtn,
              border: "1px solid rgba(245,166,35,0.3)",
              padding: "4px 14px",
              color: "var(--amber)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--amber)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 8px rgba(245,166,35,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,166,35,0.3)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "❙❙ PAUSE" : "▶ PLAY"}
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            style={controlBtn}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? "VOL OFF" : "VOL ON"}
          </button>

          {/* Volume slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="w-16"
            style={{
              accentColor: "var(--amber)",
              cursor: "pointer",
            }}
            aria-label="Volume"
          />

          <span className="flex-1" />

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            style={controlBtn}
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? "[ EXIT ]" : "[ FULL ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
