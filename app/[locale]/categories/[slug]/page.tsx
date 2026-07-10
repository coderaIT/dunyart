import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { getCategoryBySlug } from "@/lib/queries";
import { localizedName, localizedDescription } from "@/lib/utils";
import { RugGrid, EmptyState } from "@/components/rug-grid";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: localizedName(category, locale) };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("category");
  const category = await getCategoryBySlug(slug);

  if (!category || !category.isActive) {
    notFound();
  }

  const name = localizedName(category, locale);
  const description = localizedDescription(category, locale);

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={name}
              fill
              className="banner-image object-cover opacity-30"
              priority
            />
          ) : null}
          <div className="overlay-banner absolute inset-0" />
        </div>
        <div className="container-page relative py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-onimage-soft">
            {t("itemsCount", { count: category.rugs.length })}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-onimage sm:text-5xl">
            {name}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-onimage-muted">{description}</p>
          )}
        </div>
      </section>

      <div className="container-page py-14">
        {category.rugs.length > 0 ? (
          <RugGrid rugs={category.rugs} locale={locale} />
        ) : (
          <EmptyState message={t("empty")} />
        )}
      </div>
    </div>
  );
}
