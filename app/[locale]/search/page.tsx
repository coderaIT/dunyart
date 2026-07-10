import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { searchRugs } from "@/lib/queries";
import { RugGrid, EmptyState } from "@/components/rug-grid";
import { SearchBox } from "@/components/search-box";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return { title: t("title") };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("search");
  const query = (q ?? "").trim();
  const results = query ? await searchRugs(query) : [];

  return (
    <div className="container-page animate-fade-up py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cream sm:text-4xl">
          {t("title")}
        </h1>
        <span className="mt-3 block h-1 w-16 rounded-full bg-rust" />
      </div>

      <div className="mb-10 max-w-2xl">
        <SearchBox autoFocus defaultValue={query} size="lg" />
      </div>

      {query ? (
        <>
          <p className="mb-6 text-muted">
            {t("resultsFor", { query })} · {t("resultsCount", { count: results.length })}
          </p>
          {results.length > 0 ? (
            <RugGrid rugs={results} locale={locale} />
          ) : (
            <EmptyState message={t("noResults")} />
          )}
        </>
      ) : (
        <EmptyState message={t("startTyping")} />
      )}
    </div>
  );
}
