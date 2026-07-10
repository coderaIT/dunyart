"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === current) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname + params are compatible across locales
        { pathname, params },
        { locale }
      );
    });
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-line bg-ink-soft p-0.5 text-sm ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              active ? "bg-rust text-white shadow" : "text-muted hover:text-cream"
            }`}
          >
            {localeLabels[locale]}
          </button>
        );
      })}
    </div>
  );
}
