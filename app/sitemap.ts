import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getSitemapEntities } from "@/lib/queries";
import { absoluteLocaleUrl, getSiteUrl } from "@/lib/seo";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/special-offers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/new-arrivals", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/search", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure getSiteUrl is evaluated (helps caching/debug in some hosts)
  void getSiteUrl();

  const { categories, rugs } = await getSitemapEntities();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of STATIC_PATHS) {
      entries.push({
        url: absoluteLocaleUrl(locale, page.path),
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }

    for (const category of categories) {
      entries.push({
        url: absoluteLocaleUrl(locale, `/categories/${category.slug}`),
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }

    for (const rug of rugs) {
      entries.push({
        url: absoluteLocaleUrl(locale, `/rugs/${rug.slug}`),
        lastModified: rug.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
