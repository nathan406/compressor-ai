/**
 * POST /api/jobs/upload
 * Returns a presigned Cloudflare R2 URL so the browser can upload a model file
 * directly to storage without passing through the server.
 *
 * Body:   { filename: string; contentType: string; size: number }
 * 200:    { uploadUrl: string; key: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getUser } from "@/lib/middleware";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Return early if R2 is not configured — the demo works without file uploads
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY) {
    return NextResponse.json(
      { error: "File storage not configured. Add R2 credentials to enable model uploads." },
      { status: 503 }
    );
  }

  const body        = await req.json().catch(() => ({}));
  const filename    = String(body.filename    ?? "model.bin");
  const contentType = String(body.contentType ?? "application/octet-stream");
  const size        = Number(body.size        ?? 0);

  const s3 = new S3Client({
    region:      "auto",
    endpoint:    process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY!,
      secretAccessKey: process.env.R2_SECRET_KEY!,
    },
  });

  const key     = `models/${user.userId}/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket:        process.env.R2_BUCKET ?? "compressor-ai-models",
    Key:           key,
    ContentType:   contentType,
    ContentLength: size,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return NextResponse.json({ uploadUrl, key });
}
