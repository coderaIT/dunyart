"use client";

import Image, { type ImageProps } from "next/image";

/**
 * User-uploaded media should skip the optimizer so files served via
 * /api/media (or legacy /uploads) always display on the server.
 */
export function MediaImage({
  src,
  alt,
  className,
  fill,
  sizes,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const isUpload =
    src.startsWith("/api/media/") ||
    src.startsWith("/uploads/") ||
    src.includes("/api/media/");

  const props: ImageProps = {
    src,
    alt,
    className,
    sizes,
    priority,
    ...(fill ? { fill: true } : { width: width ?? 400, height: height ?? 300 }),
    ...(isUpload ? { unoptimized: true } : {}),
  };

  return <Image {...props} />;
}
