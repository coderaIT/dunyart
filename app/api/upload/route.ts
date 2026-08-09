import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  UPLOAD_DIR,
  LEGACY_UPLOAD_DIR,
  mediaUrl,
  safePublicId,
} from "@/lib/upload-dir";

export const runtime = "nodejs";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

function extFor(type: string) {
  switch (type) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/avif":
      return ".avif";
    default:
      return ".jpg";
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const uploaded: { imageUrl: string; publicId: string }[] = [];

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${file.name}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicId = `${crypto.randomUUID()}${extFor(file.type)}`;
    await writeFile(path.join(UPLOAD_DIR, publicId), buffer);
    uploaded.push({ imageUrl: mediaUrl(publicId), publicId });
  }

  return NextResponse.json({ files: uploaded });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const { publicId } = await request.json().catch(() => ({ publicId: null }));
  if (!publicId || typeof publicId !== "string") {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  const safe = safePublicId(publicId);
  for (const dir of [UPLOAD_DIR, LEGACY_UPLOAD_DIR]) {
    try {
      await unlink(path.join(dir, safe));
    } catch {
      // ignore missing
    }
  }
  return NextResponse.json({ ok: true });
}
