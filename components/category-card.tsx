import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { localizedName } from "@/lib/utils";
import type { CategoryWithCount } from "@/lib/queries";
import { Placeholder } from "./rug-card";

export async function CategoryCard({
  category,
  locale,
}: {
  category: CategoryWithCount;
  locale: Locale;
}) {
  const t = await getTranslations("category");
  const name = localizedName(category, locale);

  return (
    <Link
      href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
      className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <div className="absolute inset-0">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Placeholder />
        )}
        <div className="overlay-card absolute inset-0" />
      </div>

      <div className="relative p-4">
        <h3 className="text-lg font-semibold text-onimage transition-colors group-hover:text-sand">
          {name}
        </h3>
        <p className="mt-0.5 text-xs text-onimage-soft">
          {t("itemsCount", { count: category._count.rugs })}
        </p>
      </div>
    </Link>
  );
}
