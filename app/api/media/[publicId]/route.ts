import { NextResponse } from "next/server";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";
import {
  UPLOAD_DIR,
  LEGACY_UPLOAD_DIR,
  safePublicId,
} from "@/lib/upload-dir";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

async function resolveFile(name: string): Promise<string | null> {
  const candidates = [
    path.join(UPLOAD_DIR, name),
    path.join(LEGACY_UPLOAD_DIR, name),
  ];
  for (const file of candidates) {
    try {
      await access(file, constants.R_OK);
      return file;
    } catch {
      // try next
    }
  }
  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await context.params;
  const name = safePublicId(decodeURIComponent(publicId));
  if (!name) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const filePath = await resolveFile(name);
  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await readFile(filePath);
  const ext = path.extname(name).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
