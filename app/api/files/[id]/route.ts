import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FileRecord } from "@/types";

const BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION || "us-east-1";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Same mock data as the list endpoint — in a real app, this would be a shared module
const mockFiles: Record<string, FileRecord> = {
  "uap-pdf-001": {
    id: "uap-pdf-001",
    key: "may-8/UAP-INCIDENT-2019-GULF-OF-MEXICO.pdf",
    name: "UAP-INCIDENT-2019-GULF-OF-MEXICO.pdf",
    type: "pdf",
    size: 2_451_234,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
    pageCount: 47,
  },
  "uap-pdf-002": {
    id: "uap-pdf-002",
    key: "may-8/NAVY-PILOT-DEBRIEF-2004-NIMITZ.pdf",
    name: "NAVY-PILOT-DEBRIEF-2004-NIMITZ.pdf",
    type: "pdf",
    size: 1_874_023,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
    pageCount: 23,
  },
  "uap-pdf-003": {
    id: "uap-pdf-003",
    key: "may-8/AARO-REPORT-2023-ANNUAL-HISTORICAL.pdf",
    name: "AARO-REPORT-2023-ANNUAL-HISTORICAL.pdf",
    type: "pdf",
    size: 8_221_045,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
    pageCount: 112,
  },
  "uap-pdf-004": {
    id: "uap-pdf-004",
    key: "may-8/DIA-ANOMALOUS-AEROSPACE-THREATS-BRIEFING.pdf",
    name: "DIA-ANOMALOUS-AEROSPACE-THREATS-BRIEFING.pdf",
    type: "pdf",
    size: 3_102_884,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
    pageCount: 38,
  },
  "uap-vid-001": {
    id: "uap-vid-001",
    key: "may-8/UAP-FOOTAGE-CLASSIFIED-GOFAST.mp4",
    name: "UAP-FOOTAGE-CLASSIFIED-GOFAST.mp4",
    type: "video",
    size: 48_234_091,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
    duration: 34,
  },
  "uap-vid-002": {
    id: "uap-vid-002",
    key: "may-8/FLIR1-NIMITZ-ENCOUNTER-2004.mp4",
    name: "FLIR1-NIMITZ-ENCOUNTER-2004.mp4",
    type: "video",
    size: 72_918_334,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
    duration: 181,
  },
  "uap-img-001": {
    id: "uap-img-001",
    key: "may-8/radar-contact-image-001.jpg",
    name: "radar-contact-image-001.jpg",
    type: "image",
    size: 1_023_849,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
  },
  "uap-img-002": {
    id: "uap-img-002",
    key: "may-8/USSGRAHAM-THERMAL-2019-12-08.jpg",
    name: "USSGRAHAM-THERMAL-2019-12-08.jpg",
    type: "image",
    size: 876_234,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
  },
  "uap-img-003": {
    id: "uap-img-003",
    key: "may-8/PENTAGON-UAP-BRIEFING-SLIDE-03.jpg",
    name: "PENTAGON-UAP-BRIEFING-SLIDE-03.jpg",
    type: "image",
    size: 542_019,
    lastModified: "2025-05-08T12:00:00Z",
    releaseDate: "may-8",
  },
  "uap-pdf-005": {
    id: "uap-pdf-005",
    key: "may-22/UAP-SHAPE-ANALYSIS-REPORT-CLASSIFIED.pdf",
    name: "UAP-SHAPE-ANALYSIS-REPORT-CLASSIFIED.pdf",
    type: "pdf",
    size: 4_883_120,
    lastModified: "2025-05-22T12:00:00Z",
    releaseDate: "may-22",
    pageCount: 64,
  },
  "uap-pdf-006": {
    id: "uap-pdf-006",
    key: "may-22/WRIGHT-PAT-MATERIALS-ANALYSIS-RECOVERED.pdf",
    name: "WRIGHT-PAT-MATERIALS-ANALYSIS-RECOVERED.pdf",
    type: "pdf",
    size: 2_198_034,
    lastModified: "2025-05-22T12:00:00Z",
    releaseDate: "may-22",
    pageCount: 31,
  },
  "uap-vid-003": {
    id: "uap-vid-003",
    key: "may-22/GIMBAL-INFRARED-FOOTAGE-REDACTED.mp4",
    name: "GIMBAL-INFRARED-FOOTAGE-REDACTED.mp4",
    type: "video",
    size: 61_445_221,
    lastModified: "2025-05-22T12:00:00Z",
    releaseDate: "may-22",
    duration: 67,
  },
  "uap-img-004": {
    id: "uap-img-004",
    key: "may-22/SPHERICAL-OBJECT-OVER-MIDDLE-EAST-2022.jpg",
    name: "SPHERICAL-OBJECT-OVER-MIDDLE-EAST-2022.jpg",
    type: "image",
    size: 2_341_098,
    lastModified: "2025-05-22T12:00:00Z",
    releaseDate: "may-22",
  },
  "uap-img-005": {
    id: "uap-img-005",
    key: "may-22/USS-KEARSARGE-UAP-PHOTO-TRIANGULATED.jpg",
    name: "USS-KEARSARGE-UAP-PHOTO-TRIANGULATED.jpg",
    type: "image",
    size: 1_129_830,
    lastModified: "2025-05-22T12:00:00Z",
    releaseDate: "may-22",
  },
};

function idToKey(id: string): string {
  return Buffer.from(id, "base64url").toString("utf-8");
}

function keyToType(key: string): "pdf" | "video" | "image" {
  const lower = key.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.match(/\.(mp4|mov|avi|mkv|webm)$/)) return "video";
  return "image";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!BUCKET || !ACCESS_KEY || !SECRET_KEY) {
    const file = mockFiles[id];
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json({ url: null, metadata: file });
  }

  try {
    const key = idToKey(id);
    const name = key.split("/").pop() || key;
    const releaseDate = key.startsWith("may-22/") ? "may-22" : "may-8";

    const metadata: FileRecord = {
      id,
      key,
      name,
      type: keyToType(key),
      size: 0,
      lastModified: "",
      releaseDate,
    };

    const client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
    });

    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const url = await getSignedUrl(client, command, { expiresIn: 900 });

    return NextResponse.json({ url, metadata });
  } catch (err) {
    console.error("S3 presign error:", err);
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}
