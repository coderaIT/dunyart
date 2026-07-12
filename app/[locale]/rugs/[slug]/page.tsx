import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { getRugBySlug, getRelatedRugs } from "@/lib/queries";
import { localizedName, localizedDescription } from "@/lib/utils";
import { RugGallery } from "@/components/rug-gallery";
import { RugGrid } from "@/components/rug-grid";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const rug = await getRugBySlug(slug);
  if (!rug) return {};
  return { title: localizedName(rug, locale) };
}

export default async function RugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("rug");
  const tContact = await getTranslations("contact");
  const rug = await getRugBySlug(slug);

  if (!rug || !rug.isActive) {
    notFound();
  }

  const name = localizedName(rug, locale);
  const description = localizedDescription(rug, locale);
  const categoryName = localizedName(rug.category, locale);
  const related = await getRelatedRugs(rug.categoryId, rug.id);

  const badges = [
    rug.isSpecialOffer && { label: t("specialOffer"), cls: "bg-rust text-white" },
    rug.isNewArrival && { label: t("newArrival"), cls: "bg-olive text-onaccent" },
    rug.isFeatured && { label: t("featured"), cls: "bg-sand text-onaccent" },
  ].filter(Boolean) as { label: string; cls: string }[];

  return (
    <div className="container-page animate-fade-up py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link
          href={{ pathname: "/categories/[slug]", params: { slug: rug.category.slug } }}
          className="transition-colors hover:text-cream"
        >
          ← {categoryName}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <RugGallery images={rug.images} alt={name} />

        <div>
          <Link
            href={{ pathname: "/categories/[slug]", params: { slug: rug.category.slug } }}
            className="text-sm font-medium uppercase tracking-wide text-olive-soft hover:text-olive"
          >
            {categoryName}
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-cream sm:text-4xl">
            {name}
          </h1>

          {badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${b.cls}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-cream-soft">
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(name)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-olive px-7 py-3 font-semibold text-onaccent transition-colors hover:bg-olive-soft"
            >
              {tContact("whatsapp")}
            </a>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="rounded-full border border-line px-7 py-3 font-semibold text-cream transition-colors hover:border-olive hover:bg-panel"
            >
              {tContact("phone")}
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-cream">
            {t("relatedTitle")}
          </h2>
          <RugGrid rugs={related} locale={locale} />
        </section>
      )}
    </div>
  );
}
