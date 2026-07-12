"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { localizedName } from "@/lib/utils";
import type { RugWithImages } from "@/lib/queries";
import { MediaImage } from "./media-image";

export function RugCard({
  rug,
  locale,
}: {
  rug: RugWithImages;
  locale: Locale;
}) {
  const t = useTranslations("rug");
  const name = localizedName(rug, locale);
  const primary = rug.images[0];
  const categoryName = localizedName(rug.category, locale);

  return (
    <Link
      href={{ pathname: "/rugs/[slug]", params: { slug: rug.slug } }}
      className="group card-lift flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-olive/60 hover:shadow-xl hover:shadow-black/40"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink-soft">
        {primary ? (
          <MediaImage
            src={primary.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Placeholder />
        )}

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          {rug.isSpecialOffer && (
            <Badge className="bg-rust text-white">{t("specialOffer")}</Badge>
          )}
          {rug.isNewArrival && (
            <Badge className="bg-olive text-onaccent">{t("newArrival")}</Badge>
          )}
          {rug.isFeatured && (
            <Badge className="bg-sand text-onaccent">{t("featured")}</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-olive-soft">
          {categoryName}
        </span>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-cream transition-colors group-hover:text-sand">
          {name}
        </h3>
      </div>
    </Link>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold shadow ${className}`}
    >
      {children}
    </span>
  );
}

export function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-panel-soft to-ink-soft">
      <Image
        src="/logo.png"
        alt=""
        width={72}
        height={72}
        className="h-16 w-16 opacity-25"
      />
    </div>
  );
}
