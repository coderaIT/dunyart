"use client";
// @ts-nocheck
import Image from "next/image";
import { useEffect, useState } from "react";
import { MediaImage } from "./media-image";

type GalleryImage = {
  id: string;
  imageUrl: string;
};

export function RugGallery({
  images,
  alt,
}: {
  images: GalleryImage[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomed]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-line bg-panel">
        <Image
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          className="opacity-20"
        />
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-panel"
        aria-label={alt}
      >
        <MediaImage
          src={current.imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                i === active
                  ? "border-rust"
                  : "border-line hover:border-olive"
              }`}
            >
              <MediaImage
                src={img.imageUrl}
                alt=""
                fill
                sizes="15vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl leading-none text-white transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            ×
          </button>

          <div
            className="relative h-full w-full max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaImage
              src={current.imageUrl}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
