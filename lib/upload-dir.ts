import path from "node:path";

/** Runtime uploads live here (survives better than relying on Next static-only). */
export const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

/** Legacy location used by older uploads. */
export const LEGACY_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads"
);

export function safePublicId(publicId: string): string {
  return path.basename(publicId);
}

export function mediaUrl(publicId: string): string {
  return `/api/media/${safePublicId(publicId)}`;
}
