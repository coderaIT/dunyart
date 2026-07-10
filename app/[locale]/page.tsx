import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import {
  getActiveCategories,
  getSpecialOffers,
  getNewArrivals,
  getLatestRugs,
} from "@/lib/queries";
import { CategoryCard } from "@/components/category-card";
import { RugGrid } from "@/components/rug-grid";
import { SectionHeader } from "@/components/section-header";
import { SearchBox } from "@/components/search-box";
import { SITE } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tContact = await getTranslations("contact");

  const [categories, offers, arrivals, latest] = await Promise.all([
    getActiveCategories(),
    getSpecialOffers(4),
    getNewArrivals(4),
    getLatestRugs(8),
  ]);

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="overlay-hero absolute inset-0" />
        </div>
        <div className="container-page flex min-h-[28rem] flex-col items-center justify-center py-20 text-center sm:min-h-[32rem] sm:py-28">
          <span className="mb-4 rounded-full border border-onimage/25 bg-scrim/35 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-onimage-soft backdrop-blur-sm">
            {t("categoriesSubtitle")}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-onimage sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-onimage-muted sm:text-lg">
            {t("heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#categories"
              className="rounded-full bg-rust px-7 py-3 font-semibold text-white transition-colors hover:bg-rust-soft"
            >
              {t("browseCategories")}
            </a>
            <Link
              href="/new-arrivals"
              className="rounded-full border border-onimage/35 px-7 py-3 font-semibold text-onimage transition-colors hover:border-onimage hover:bg-onimage/10"
            >
              {t("newArrivalsTitle")}
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page space-y-24 py-20">
        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <SectionHeader
              id="categories"
              title={t("categoriesTitle")}
              subtitle={t("categoriesSubtitle")}
            />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        )}

        {/* Special Offers */}
        {offers.length > 0 && (
          <section>
            <SectionHeader
              title={t("specialOffersTitle")}
              subtitle={t("specialOffersSubtitle")}
              viewAllHref="/special-offers"
              viewAllLabel={t("viewAll")}
            />
            <RugGrid rugs={offers} locale={locale} />
          </section>
        )}

        {/* New Arrivals */}
        {arrivals.length > 0 && (
          <section>
            <SectionHeader
              title={t("newArrivalsTitle")}
              subtitle={t("newArrivalsSubtitle")}
              viewAllHref="/new-arrivals"
              viewAllLabel={t("viewAll")}
            />
            <RugGrid rugs={arrivals} locale={locale} />
          </section>
        )}

        {/* Latest added */}
        {latest.length > 0 && (
          <section>
            <SectionHeader
              title={t("latestTitle")}
              subtitle={t("latestSubtitle")}
            />
            <RugGrid rugs={latest} locale={locale} />
          </section>
        )}

        {/* Search */}
        <section className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-soft to-ink-soft p-8 text-center shadow-sm sm:p-14">
          <h2 className="text-2xl font-bold text-cream sm:text-3xl">
            {t("searchTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("searchSubtitle")}</p>
          <div className="mx-auto mt-6 max-w-xl">
            <SearchBox />
          </div>
        </section>

        {/* Contact */}
        <section>
          <SectionHeader
            title={t("contactTitle")}
            subtitle={t("contactSubtitle")}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <ContactCard
              label={tContact("phone")}
              value={SITE.phone}
              href={`tel:${SITE.phone}`}
            />
            <ContactCard
              label={tContact("whatsapp")}
              value={SITE.phone}
              href={`https://wa.me/${SITE.whatsapp}`}
            />
            <ContactCard
              label={tContact("email")}
              value={SITE.email}
              href={`mailto:${SITE.email}`}
            />
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full border border-line px-7 py-3 font-semibold text-cream transition-colors hover:border-olive hover:bg-panel"
            >
              {tContact("title")} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="rounded-2xl border border-line bg-panel p-6 text-center transition-colors hover:border-olive"
    >
      <div className="text-sm font-medium uppercase tracking-wide text-olive-soft">
        {label}
      </div>
      <div dir="ltr" className="mt-2 text-lg font-semibold text-cream">
        {value}
      </div>
    </a>
  );
}
