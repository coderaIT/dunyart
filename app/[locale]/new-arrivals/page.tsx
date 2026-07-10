import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { getNewArrivals } from "@/lib/queries";
import { RugGrid, EmptyState } from "@/components/rug-grid";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: t("newArrivalsTitle") };
}

export default async function NewArrivalsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const rugs = await getNewArrivals();

  return (
    <div className="container-page animate-fade-up py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-cream sm:text-4xl">
          {t("newArrivalsTitle")}
        </h1>
        <p className="mt-2 text-muted">{t("newArrivalsSubtitle")}</p>
        <span className="mt-3 block h-1 w-16 rounded-full bg-rust" />
      </div>

      {rugs.length > 0 ? (
        <RugGrid rugs={rugs} locale={locale} />
      ) : (
        <EmptyState message={t("noItems")} />
      )}
    </div>
  );
}
