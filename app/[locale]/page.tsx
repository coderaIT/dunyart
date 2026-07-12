import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { getCategoriesWithRugs, getLatestRugs } from "@/lib/queries";
import { localizedName, localizedDescription } from "@/lib/utils";
import { HeroSlider } from "@/components/hero-slider";
import { ExpandableRugGrid } from "@/components/expandable-rug-grid";
import { SectionHeader } from "@/components/section-header";
import { SearchBox } from "@/components/search-box";
import { ServicesSection } from "@/components/services-section";
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
  const tCategory = await getTranslations("category");

  const [categories, latest] = await Promise.all([
    getCategoriesWithRugs(),
    getLatestRugs(24),
  ]);

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <HeroSlider />
        <div className="container-page flex min-h-[28rem] flex-col items-center justify-center py-20 text-center sm:min-h-[32rem] sm:py-28">
          <span className="mb-4 rounded-full border border-white/25 bg-scrim/55 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/90 backdrop-blur-sm">
            {t("categoriesSubtitle")}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.4)] sm:text-lg">
            {t("heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#categories"
              className="rounded-full bg-rust px-7 py-3 font-semibold text-white transition-colors hover:bg-rust-soft"
            >
              {t("browseCategories")}
            </a>
            <a
              href="#latest"
              className="rounded-full border border-white/50 bg-scrim/30 px-7 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-scrim/50"
            >
              {t("latestTitle")}
            </a>
          </div>
        </div>
      </section>

      <div className="container-page space-y-24 py-20">
        {/* Services — directly under hero */}
        <ServicesSection />

        {/* Three category sections */}
        <div id="categories" className="scroll-mt-28 space-y-24">
          {categories.map((category) => {
            const title = localizedName(category, locale);
            const subtitle =
              localizedDescription(category, locale) ?? undefined;
            return (
              <section key={category.id} id={category.slug} className="scroll-mt-28">
                <SectionHeader title={title} subtitle={subtitle} />
                <ExpandableRugGrid
                  rugs={category.rugs}
                  locale={locale}
                  emptyMessage={tCategory("empty")}
                />
              </section>
            );
          })}
        </div>

        {/* Latest added across all categories */}
        {latest.length > 0 && (
          <section>
            <SectionHeader
              id="latest"
              title={t("latestTitle")}
              subtitle={t("latestSubtitle")}
            />
            <ExpandableRugGrid rugs={latest} locale={locale} />
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
              href={`tel:${SITE.phoneTel}`}
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
