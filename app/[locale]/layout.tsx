import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirections, type Locale } from "@/i18n/routing";
import { Header } from "@/components/header";
import { LocationMap } from "@/components/location-map";
import { Footer } from "@/components/footer";
import { ThemeScript } from "@/components/theme-script";
import { JsonLd, localBusinessJsonLd } from "@/components/json-ld";
import { buildPageMetadata, getSiteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const page = buildPageMetadata({
    locale,
    path: "/",
    description: t("description"),
  });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: t("description"),
    keywords: t("keywords")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    applicationName: SITE.brandName,
    authors: [{ name: SITE.brandName, url: getSiteUrl() }],
    creator: SITE.brandName,
    publisher: SITE.brandName,
    category: "shopping",
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    icons: {
      icon: [
        { url: "/icon.png?v=2", type: "image/png", sizes: "512x512" },
        { url: "/apple-icon.png?v=2", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png?v=2", sizes: "512x512" }],
      shortcut: ["/icon.png?v=2"],
    },
    ...page,
    openGraph: {
      ...page.openGraph,
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
    },
    twitter: {
      ...page.twitter,
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = localeDirections[locale as Locale];
  const t = await getTranslations({ locale, namespace: "site" });

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-ink text-cream">
        <ThemeScript />
        <JsonLd data={localBusinessJsonLd(t("name"), t("description"))} />
        <NextIntlClientProvider>
          <Header locale={locale as Locale} />
          <main className="flex-1">{children}</main>
          <LocationMap />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
