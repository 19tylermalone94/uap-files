"use client";

import { motion } from "framer-motion";
import FileCard from "./FileCard";
import type { FileRecord } from "@/types";

interface FileGridProps {
  files: FileRecord[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function FileGrid({ files }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-4"
        style={{ color: "rgba(0,255,157,0.4)" }}
      >
        <div style={{ fontSize: "3rem", opacity: 0.3 }}>[ ]</div>
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
          }}
        >
          NO RECORDS FOUND
        </p>
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            opacity: 0.5,
          }}
        >
          // ADJUST FILTERS TO EXPAND SEARCH
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {files.map((file, index) => (
        <FileCard key={file.id} file={file} index={index} />
      ))}
    </motion.div>
  );
}
