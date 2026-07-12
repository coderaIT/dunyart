import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirections, type Locale } from "@/i18n/routing";
import { Header } from "@/components/header";
import { LocationMap } from "@/components/location-map";
import { Footer } from "@/components/footer";
import { ThemeScript } from "@/components/theme-script";
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
  return {
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: t("tagline"),
    icons: {
      icon: [
        { url: "/icon.png?v=2", type: "image/png", sizes: "512x512" },
        { url: "/apple-icon.png?v=2", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png?v=2", sizes: "512x512" }],
      shortcut: ["/icon.png?v=2"],
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

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-ink text-cream">
        <ThemeScript />
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
