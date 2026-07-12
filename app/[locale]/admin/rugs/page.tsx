import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { AdminRugsTable } from "@/components/admin/admin-rugs-table";

export default async function AdminRugsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const rugs = await prisma.rug.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
    },
  });

  const rows = rugs.map((rug) => ({
    id: rug.id,
    nameAr: rug.nameAr,
    isSpecialOffer: rug.isSpecialOffer,
    isNewArrival: rug.isNewArrival,
    isFeatured: rug.isFeatured,
    isActive: rug.isActive,
    categoryName: rug.category.nameAr,
    imageUrl: rug.images[0]?.imageUrl ?? null,
    imageCount: rug.images.length,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-cream">السجاد</h1>
          <p className="mt-1 text-sm text-muted">
            {rugs.length} سجادة — يمكنك تحديد عدة عناصر وحذفها دفعة واحدة
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/rugs/batch"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-olive hover:bg-panel"
          >
            رفع دفعة صور
          </Link>
          <Link
            href="/admin/rugs/new"
            className="rounded-full bg-rust px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rust-soft"
          >
            + إضافة سجادة
          </Link>
        </div>
      </div>

      <AdminRugsTable rugs={rows} />
    </div>
  );
}
