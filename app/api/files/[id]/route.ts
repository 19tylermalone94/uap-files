import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FileRecord } from "@/types";
import { mockFilesById } from "@/lib/mock-files";

const BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION || "us-east-1";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

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
    const file = mockFilesById[id];
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json({ url: null, metadata: file });
  }

  try {
    const key = idToKey(id);
    const name = key.split("/").pop() || key;
    const releaseDate = key.split("/")[0] as FileRecord["releaseDate"];

    const client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
    });

    const head = await client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key })
    );

    const metadata: FileRecord = {
      id,
      key,
      name,
      type: keyToType(key),
      size: head.ContentLength ?? 0,
      lastModified: head.LastModified?.toISOString() ?? "",
      releaseDate,
    };

    const url = await getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 900 }
    );

    return NextResponse.json({ url, metadata });
  } catch (err) {
    console.error("S3 detail error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 }
    );
  }
}
