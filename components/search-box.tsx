"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SearchBox({
  autoFocus = false,
  defaultValue = "",
  size = "md",
}: {
  autoFocus?: boolean;
  defaultValue?: string;
  size?: "md" | "lg";
}) {
  const t = useTranslations("search");
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push({ pathname: "/search", query: q ? { q } : {} });
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-muted">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("placeholder")}
          className={`w-full rounded-full border border-line bg-ink-soft ps-11 pe-4 text-cream placeholder:text-muted outline-none transition-colors focus:border-olive ${
            size === "lg" ? "py-4 text-lg" : "py-3"
          }`}
        />
      </div>
      <button
        type="submit"
        className={`rounded-full bg-rust font-semibold text-white transition-colors hover:bg-rust-soft ${
          size === "lg" ? "px-8 text-lg" : "px-6"
        }`}
      >
        {t("button")}
      </button>
    </form>
  );
}
