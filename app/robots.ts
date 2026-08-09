import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: locales.flatMap((locale) => [
          `/${locale}/admin`,
          `/${locale}/admin/`,
          `/${locale}/admin/login`,
        ]),
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
