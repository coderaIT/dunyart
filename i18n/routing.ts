import { defineRouting } from "next-intl/routing";

export const locales = ["tr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeDirections: Record<Locale, "rtl" | "ltr"> = {
  tr: "ltr",
  ar: "rtl",
  en: "ltr",
};

export const localeLabels: Record<Locale, string> = {
  tr: "Türkçe",
  ar: "العربية",
  en: "English",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "tr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/special-offers": "/special-offers",
    "/new-arrivals": "/new-arrivals",
    "/search": "/search",
    "/contact": "/contact",
    "/categories/[slug]": "/categories/[slug]",
    "/rugs/[slug]": "/rugs/[slug]",
    "/admin": "/admin",
    "/admin/categories": "/admin/categories",
    "/admin/categories/new": "/admin/categories/new",
    "/admin/categories/[id]": "/admin/categories/[id]",
    "/admin/rugs": "/admin/rugs",
    "/admin/rugs/new": "/admin/rugs/new",
    "/admin/rugs/batch": "/admin/rugs/batch",
    "/admin/rugs/[id]": "/admin/rugs/[id]",
  },
});
