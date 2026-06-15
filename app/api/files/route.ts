import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { FileRecord } from "@/types";
import { mockFiles } from "@/lib/mock-files";
import { keyToType } from "@/lib/s3";

export const revalidate = 3600;

const BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION || "us-east-1";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

function keyToId(key: string): string {
  return Buffer.from(key).toString("base64url");
}

export async function GET() {
  if (!BUCKET || !ACCESS_KEY || !SECRET_KEY) {
    return NextResponse.json(mockFiles);
  }

  try {
    const client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
    });

    const allFiles: FileRecord[] = [];

    for (const prefix of ["may-8/", "may-22/"]) {
      const releaseDate = prefix.replace("/", "") as "may-8" | "may-22";

      let continuationToken: string | undefined;
      do {
        const response = await client.send(
          new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: prefix,
            ContinuationToken: continuationToken,
          })
        );

        for (const obj of response.Contents || []) {
          if (!obj.Key || obj.Key === prefix) continue;

          const name = obj.Key.split("/").pop() || obj.Key;
          const type = keyToType(obj.Key);

          allFiles.push({
            id: keyToId(obj.Key),
            key: obj.Key,
            name,
            type,
            size: obj.Size || 0,
            lastModified: obj.LastModified?.toISOString() || "",
            releaseDate,
          });
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);
    }

    return NextResponse.json(allFiles);
  } catch (err) {
    console.error("S3 list error:", err);
    return NextResponse.json(mockFiles);
  }
}
