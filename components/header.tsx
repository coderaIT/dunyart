"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/special-offers" as const, label: t("specialOffers") },
    { href: "/new-arrivals" as const, label: t("newArrivals") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="site-header sticky top-0 z-50 border-b border-line/70 bg-ink/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt={tSite("name")}
            width={52}
            height={52}
            className="h-12 w-12 object-contain"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-wide text-cream">
              {tSite("name")}
            </span>
            <span className="text-xs text-olive-soft">{tSite("tagline")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-panel hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`/${locale}#categories`}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-panel hover:text-cream"
          >
            {t("categories")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label={t("search")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-olive hover:text-cream"
          >
            <SearchIcon />
          </Link>
          <ThemeToggle />
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} />
          </div>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-cream lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-ink-soft lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-cream transition-colors hover:bg-panel"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`/${locale}#categories`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-cream transition-colors hover:bg-panel"
            >
              {t("categories")}
            </a>
            <div className="px-4 pt-3 sm:hidden">
              <LanguageSwitcher current={locale} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
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
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
