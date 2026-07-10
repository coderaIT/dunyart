import { type Locale } from "@/i18n/routing";
import { RugCard } from "./rug-card";
import type { RugWithImages } from "@/lib/queries";

export function RugGrid({
  rugs,
  locale,
}: {
  rugs: RugWithImages[];
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {rugs.map((rug) => (
        <RugCard key={rug.id} rug={rug} locale={locale} />
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-panel/40 px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-panel text-muted">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 4v16" />
        </svg>
      </div>
      <p className="max-w-sm text-muted">{message}</p>
    </div>
  );
}
