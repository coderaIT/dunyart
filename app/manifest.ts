import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.brandName,
    short_name: SITE.brandName,
    description:
      "Sanatsal ve lüks halılar, baskı ve tekstil hizmetleri — Dünya Art, Bursa.",
    start_url: "/tr",
    display: "standalone",
    background_color: "#16130f",
    theme_color: "#c0562f",
    lang: "tr",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
