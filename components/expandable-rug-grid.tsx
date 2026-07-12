"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Locale } from "@/i18n/routing";
import type { RugWithImages } from "@/lib/queries";
import { RugCard } from "./rug-card";
import { EmptyState } from "./rug-grid";

/** 1 row × 4 columns */
export const GRID_PAGE_SIZE = 4;

export function ExpandableRugGrid({
  rugs,
  locale,
  emptyMessage,
  pageSize = GRID_PAGE_SIZE,
}: {
  rugs: RugWithImages[];
  locale: Locale;
  emptyMessage?: string;
  pageSize?: number;
}) {
  const t = useTranslations("home");
  const [visible, setVisible] = useState(pageSize);

  if (rugs.length === 0) {
    return <EmptyState message={emptyMessage ?? t("noItems")} />;
  }

  const shown = rugs.slice(0, visible);
  const hasMore = visible < rugs.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {shown.map((rug) => (
          <RugCard key={rug.id} rug={rug} locale={locale} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((n) => n + pageSize)}
            className="rounded-full border border-line bg-panel px-8 py-3 text-sm font-semibold text-cream transition-colors hover:border-olive hover:bg-panel-soft"
          >
            {t("showMore")}
          </button>
        </div>
      )}
    </div>
  );
}
