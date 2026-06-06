"use client";

import { useState } from "react";

interface Filters {
  types: Set<"pdf" | "video" | "image">;
  dates: Set<"may-8" | "may-22">;
  keyword: string;
}

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

export default function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [types, setTypes] = useState<Set<"pdf" | "video" | "image">>(
    new Set<"pdf" | "video" | "image">(["pdf", "video", "image"])
  );
  const [dates, setDates] = useState<Set<"may-8" | "may-22">>(
    new Set<"may-8" | "may-22">(["may-8", "may-22"])
  );
  const [keyword, setKeyword] = useState("");

  const toggleType = (t: "pdf" | "video" | "image") => {
    const next = new Set(types);
    if (next.has(t)) {
      next.delete(t);
    } else {
      next.add(t);
    }
    setTypes(next);
    onFiltersChange({ types: next, dates, keyword });
  };

  const toggleDate = (d: "may-8" | "may-22") => {
    const next = new Set(dates);
    if (next.has(d)) {
      next.delete(d);
    } else {
      next.add(d);
    }
    setDates(next);
    onFiltersChange({ types, dates: next, keyword });
  };

  const handleKeyword = (v: string) => {
    setKeyword(v);
    onFiltersChange({ types, dates, keyword: v });
  };

  const clearAll = () => {
    const allTypes = new Set<"pdf" | "video" | "image">(["pdf" as const, "video" as const, "image" as const]);
    const allDates = new Set<"may-8" | "may-22">(["may-8" as const, "may-22" as const]);
    setTypes(allTypes);
    setDates(allDates);
    setKeyword("");
    onFiltersChange({ types: allTypes, dates: allDates, keyword: "" });
  };

  const terminalInput =
    "bg-transparent border-b border-terminal/30 focus:border-terminal/80 outline-none text-terminal placeholder-terminal/30 w-full text-xs py-1";

  const CheckRow = ({
    label,
    checked,
    onToggle,
    color = "terminal",
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
    color?: string;
  }) => (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 w-full text-left group"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
      aria-pressed={checked}
    >
      <span
        className="inline-flex items-center justify-center w-4 h-4 shrink-0"
        style={{
          border: `1px solid ${checked ? `var(--${color})` : "rgba(0,255,157,0.3)"}`,
          background: checked ? `rgba(0,255,157,0.08)` : "transparent",
          transition: "border-color 0.15s, background 0.15s",
          boxShadow: checked ? `0 0 4px var(--${color})` : "none",
        }}
      >
        {checked && (
          <span
            style={{
              width: "8px",
              height: "8px",
              background: `var(--${color})`,
              display: "block",
              boxShadow: `0 0 4px var(--${color})`,
            }}
          />
        )}
      </span>
      <span
        className="text-xs tracking-widest"
        style={{
          color: checked ? `var(--${color})` : "rgba(0,255,157,0.65)",
          transition: "color 0.15s",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </span>
    </button>
  );

  return (
    <div
      className="w-full"
      style={{
        border: "1px solid rgba(0,255,157,0.15)",
        background: "rgba(5,5,8,0.8)",
        boxShadow: "0 0 10px rgba(0,255,157,0.03)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between w-full px-4 py-3"
        aria-expanded={!collapsed}
      >
        <span
          className="text-xs tracking-widest"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "var(--terminal)",
            letterSpacing: "0.2em",
          }}
        >
          &gt;_ FILTER RECORDS
        </span>
        <span
          style={{
            color: "rgba(0,255,157,0.5)",
            fontSize: "0.75rem",
            transition: "transform 0.2s",
            display: "inline-block",
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {/* Filter body */}
      {!collapsed && (
        <div className="px-4 pb-4 space-y-5">
          <div
            className="h-px w-full"
            style={{ background: "rgba(0,255,157,0.1)" }}
          />

          {/* File type */}
          <div>
            <p
              className="text-xs mb-3 tracking-widest opacity-70"
              style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.15em" }}
            >
              {"// FILE TYPE"}
            </p>
            <div className="space-y-2">
              <CheckRow
                label="[ PDF ]"
                checked={types.has("pdf")}
                onToggle={() => toggleType("pdf")}
                color="paper"
              />
              <CheckRow
                label="[ VIDEO ]"
                checked={types.has("video")}
                onToggle={() => toggleType("video")}
                color="amber"
              />
              <CheckRow
                label="[ IMAGE ]"
                checked={types.has("image")}
                onToggle={() => toggleType("image")}
                color="terminal"
              />
            </div>
          </div>

          <div className="h-px w-full" style={{ background: "rgba(0,255,157,0.1)" }} />

          {/* Release date */}
          <div>
            <p
              className="text-xs mb-3 opacity-50 tracking-widest"
              style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.15em" }}
            >
              {"// RELEASE DATE"}
            </p>
            <div className="space-y-2">
              <CheckRow
                label="MAY 8 DROP"
                checked={dates.has("may-8")}
                onToggle={() => toggleDate("may-8")}
              />
              <CheckRow
                label="MAY 22 DROP"
                checked={dates.has("may-22")}
                onToggle={() => toggleDate("may-22")}
                color="redacted"
              />
            </div>
          </div>

          <div className="h-px w-full" style={{ background: "rgba(0,255,157,0.1)" }} />

          {/* Keyword */}
          <div>
            <p
              className="text-xs mb-2 opacity-70 tracking-widest"
              style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.15em" }}
            >
              {"// KEYWORD SEARCH"}
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-xs opacity-65 shrink-0"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: "var(--terminal)" }}
              >
                &gt;_
              </span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeyword(e.target.value)}
                placeholder="SEARCH FILES..."
                className={terminalInput}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
                aria-label="Search files"
              />
            </div>
          </div>

          {/* Clear button */}
          <button
            onClick={clearAll}
            className="w-full text-xs py-1.5 tracking-widest transition-colors"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              border: "1px solid rgba(255,60,60,0.2)",
              color: "rgba(255,60,60,0.75)",
              letterSpacing: "0.15em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,60,60,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--redacted)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,60,60,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,60,60,0.75)";
            }}
          >
            [ CLEAR ALL FILTERS ]
          </button>
        </div>
      )}
    </div>
  );
}
