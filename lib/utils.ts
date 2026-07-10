import type { Locale } from "@/i18n/routing";

/**
 * Turn a string into a URL-friendly slug.
 * Handles Turkish characters and falls back gracefully for non-latin input.
 */
export function slugify(input: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };

  const normalized = input
    .split("")
    .map((ch) => turkishMap[ch] ?? ch)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function randomSuffix(length = 5): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

type LocalizedFields = {
  nameAr: string;
  nameTr: string;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionTr?: string | null;
  descriptionEn?: string | null;
};

export function localizedName(item: LocalizedFields, locale: Locale): string {
  switch (locale) {
    case "ar":
      return item.nameAr;
    case "tr":
      return item.nameTr;
    default:
      return item.nameEn;
  }
}

export function localizedDescription(
  item: LocalizedFields,
  locale: Locale
): string | null {
  switch (locale) {
    case "ar":
      return item.descriptionAr ?? null;
    case "tr":
      return item.descriptionTr ?? null;
    default:
      return item.descriptionEn ?? null;
  }
}
