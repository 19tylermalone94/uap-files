export interface FileRecord {
  id: string;
  key: string;
  name: string;
  type: "pdf" | "video" | "image";
  size: number;
  lastModified: string;
  releaseDate: "may-8" | "may-22";
  pageCount?: number;
  duration?: number;
  thumbnailUrl?: string;
}
