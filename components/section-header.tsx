import { Link } from "@/i18n/navigation";

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
  id,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: "/special-offers" | "/new-arrivals" | "/search";
  viewAllLabel?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="mb-8 flex flex-wrap items-end justify-between gap-4 scroll-mt-28"
    >
      <div>
        <h2 className="text-2xl font-bold text-cream sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <span className="mt-3 block h-1 w-16 rounded-full bg-rust" />
      </div>
      {viewAllHref && viewAllLabel && (
        <Link
          href={viewAllHref}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-cream transition-colors hover:border-olive hover:bg-panel"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
