"use client";

import Image from "next/image";
import { useState } from "react";

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
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-panel">
        <Image
          src={current.imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

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
              <Image
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
    </div>
  );
}
