export function keyToType(key: string): "pdf" | "video" | "image" {
  const lower = key.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.match(/\.(mp4|mov|avi|mkv|webm)$/)) return "video";
  return "image";
}
