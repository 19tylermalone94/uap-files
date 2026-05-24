"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlitchText from "@/components/ui/GlitchText";
import StaticNoise from "@/components/ui/StaticNoise";

const tickerText =
  "██████ CASE NO. ████ // INCIDENT DATE ██/██/████ // LOCATION: ████████, NM // WITNESS COUNT: █ // OBJECT DESCRIPTION: ████████████████ // RADAR CONTACT: CONFIRMED // CLASSIFICATION: ████████████ // CASE NO. ████ // INCIDENT DATE ██/██/████ // LOCATION: UNDISCLOSED // ALTITUDE: █████ FT // SPEED: ██████ MPH // OCCUPANTS: ████ // RECOVERED MATERIALS: ██████████████████████ // ORIGIN: UNKNOWN // STATUS: UNDER INVESTIGATION // ";

function TypewriterText({ text, delay = 40 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "1em",
            background: "var(--terminal)",
            animation: "cursorBlink 1s step-end infinite",
            verticalAlign: "text-bottom",
            boxShadow: "0 0 6px var(--terminal)",
          }}
        />
      )}
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [staticActive, setStaticActive] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleAccess = () => {
    setStaticActive(true);
  };

  const handleStaticComplete = () => {
    router.push("/files");
  };

  return (
    <>
      <StaticNoise active={staticActive} onComplete={handleStaticComplete} duration={450} />

      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ paddingTop: "48px" }}
      >
        {/* Deep space background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(0,40,20,0.35) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(0,20,40,0.25) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(10,5,20,0.5) 0%, transparent 80%), #050508",
          }}
        />

        {/* Slowly rotating nebula ring */}
        <div
          className="absolute pointer-events-none nebula-drift"
          style={{
            width: "900px",
            height: "900px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0,255,157,0.04) 60deg, transparent 120deg, rgba(0,20,60,0.06) 180deg, transparent 240deg, rgba(0,255,157,0.03) 300deg, transparent 360deg)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />

        {/* Star field dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 5 === 0 ? "var(--terminal)" : "#fff",
                opacity: 0.1 + Math.random() * 0.4,
                boxShadow:
                  i % 5 === 0
                    ? "0 0 4px var(--terminal)"
                    : "0 0 2px rgba(255,255,255,0.5)",
                animation: `cursorBlink ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-4"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Classification banner */}
          <div
            className="mb-8 px-6 py-1.5"
            style={{
              background: "rgba(192,57,43,0.1)",
              border: "1px solid rgba(192,57,43,0.4)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "var(--stamp-red)",
              boxShadow: "0 0 10px rgba(192,57,43,0.15)",
            }}
          >
            ▮ TOP SECRET // NOFORN — NOW DECLASSIFIED ▮
          </div>

          {/* UFO/craft silhouette SVG */}
          <div
            className="mb-6 relative"
            style={{
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          >
            <svg
              width="120"
              height="60"
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0 0 12px rgba(0,255,157,0.6))" }}
            >
              {/* Main disc body */}
              <ellipse cx="60" cy="32" rx="50" ry="14" fill="rgba(0,255,157,0.08)" stroke="rgba(0,255,157,0.6)" strokeWidth="1" />
              {/* Dome */}
              <ellipse cx="60" cy="26" rx="22" ry="12" fill="rgba(0,255,157,0.06)" stroke="rgba(0,255,157,0.5)" strokeWidth="1" />
              {/* Light ring */}
              {[30, 45, 60, 75, 90].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy="34"
                  r="2"
                  fill="var(--terminal)"
                  opacity="0.8"
                  style={{
                    animation: `cursorBlink ${0.5 + i * 0.15}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
              {/* Bottom glow beam */}
              <ellipse cx="60" cy="46" rx="20" ry="4" fill="rgba(0,255,157,0.04)" />
            </svg>
          </div>

          {/* Main heading */}
          <div className="mb-4">
            <GlitchText
              text="CLASSIFIED AERIAL"
              as="h1"
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-none"
              style={{
                color: "var(--terminal)",
                textShadow: "0 0 20px rgba(0,255,157,0.4), 0 0 60px rgba(0,255,157,0.1)",
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.05em",
              }}
              intensity="medium"
            />
            <GlitchText
              text="PHENOMENA RECORDS"
              as="h1"
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-none"
              style={{
                color: "var(--terminal)",
                textShadow: "0 0 20px rgba(0,255,157,0.4), 0 0 60px rgba(0,255,157,0.1)",
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.05em",
              }}
              intensity="low"
            />
          </div>

          {/* Subheading typewriter */}
          <div
            className="mb-10"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(0.7rem, 2vw, 0.95rem)",
              color: "rgba(0,255,157,0.6)",
              letterSpacing: "0.15em",
            }}
          >
            <TypewriterText
              text="// RELEASED MAY 2025 — BROWSE THE EVIDENCE"
              delay={45}
            />
          </div>

          {/* Redacted info lines */}
          <div
            className="mb-10 flex flex-col items-center gap-2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(0,255,157,0.35)",
              letterSpacing: "0.1em",
            }}
          >
            <span>DOCUMENTS RELEASED: <span style={{ color: "var(--amber)" }}>247</span> // VIDEOS: <span style={{ color: "var(--amber)" }}>12</span> // IMAGES: <span style={{ color: "var(--amber)" }}>38</span></span>
            <span>ORIGIN: <span style={{ background: "#000", padding: "0 4px" }}>████████████</span> // AUTHORIZATION: <span style={{ background: "#000", padding: "0 4px" }}>███████</span></span>
          </div>

          {/* CTA button */}
          <button
            onClick={handleAccess}
            className="relative group"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "1rem",
              letterSpacing: "0.3em",
              color: "var(--terminal)",
              background: "transparent",
              border: "1px solid var(--terminal)",
              padding: "14px 40px",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(0,255,157,0.2), inset 0 0 10px rgba(0,255,157,0.05)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.color = "var(--black)";
              btn.style.background = "var(--terminal)";
              btn.style.boxShadow = "0 0 30px rgba(0,255,157,0.5), 0 0 60px rgba(0,255,157,0.2)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.color = "var(--terminal)";
              btn.style.background = "transparent";
              btn.style.boxShadow = "0 0 10px rgba(0,255,157,0.2), inset 0 0 10px rgba(0,255,157,0.05)";
            }}
            aria-label="Access declassified UAP files"
          >
            [ ACCESS FILES ]
          </button>

          {/* Supplemental info */}
          <div
            className="mt-6"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(0,255,157,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            SECURE CONNECTION ESTABLISHED // NO WARRANT REQUIRED // FOIA COMPLIANT
          </div>
        </div>

        {/* Footer ticker */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden border-t"
          style={{
            borderColor: "rgba(0,255,157,0.1)",
            background: "rgba(5,5,8,0.8)",
            height: "28px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="ticker-content">
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                color: "rgba(0,255,157,0.35)",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              {tickerText + tickerText}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
