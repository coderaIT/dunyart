"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  "/sliders/1.jpeg",
  "/sliders/2.jpeg",
  "/sliders/3.jpeg",
] as const;

const INTERVAL_MS = 5500;

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover object-center transition-opacity duration-1000 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="overlay-hero absolute inset-0" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2 sm:bottom-7">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-8 bg-white"
                : "w-1.5 bg-white/45 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </>
  );
}
