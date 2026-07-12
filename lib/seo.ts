import type { Metadata } from "next";
import { locales, routing, type Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  ar: "ar_SA",
  en: "en_US",
};

/** Public site origin — set NEXT_PUBLIC_SITE_URL in production. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return SITE.url;
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localePath(locale: Locale, path = "/"): string {
  const normalized =
    !path || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;
  return `/${locale}${normalized}`;
}

export function absoluteLocaleUrl(locale: Locale, path = "/"): string {
  return absoluteUrl(localePath(locale, path));
}

export function languageAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteLocaleUrl(locale, path);
  }
  languages["x-default"] = absoluteLocaleUrl(routing.defaultLocale, path);
  return languages;
}

export function toAbsoluteImage(
  src: string | null | undefined
): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return absoluteUrl(src);
}

type PageMetaInput = {
  locale: Locale;
  path?: string;
  /** Leave empty to use the layout title template / default. */
  title?: string;
  description: string;
  images?: (string | null | undefined)[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  images,
  type = "website",
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteLocaleUrl(locale, path);
  const resolvedImages = (images ?? [])
    .map((src) => toAbsoluteImage(src))
    .filter((src): src is string => Boolean(src));

  if (resolvedImages.length === 0) {
    resolvedImages.push(absoluteUrl("/logo.png"));
  }

  const ogTitle = title;

  const meta: Metadata = {
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      locale: OG_LOCALE[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      url,
      siteName: SITE.brandName,
      title: ogTitle,
      description,
      images: resolvedImages.map((imageUrl) => ({
        url: imageUrl,
        alt: ogTitle ?? SITE.brandName,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: resolvedImages,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };

  if (title) {
    meta.title = title;
  }

  return meta;
}
