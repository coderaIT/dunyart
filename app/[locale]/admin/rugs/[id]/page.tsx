import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { RugForm } from "@/components/admin/rug-form";

export default async function EditRugPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [rug, categories] = await Promise.all([
    prisma.rug.findUnique({
      where: { id },
      include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] } },
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameAr: "asc" }],
      select: { id: true, nameAr: true },
    }),
  ]);

  if (!rug) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-cream">تعديل السجادة</h1>
      <RugForm
        categories={categories.map((c) => ({ id: c.id, name: c.nameAr }))}
        initial={{
          id: rug.id,
          nameAr: rug.nameAr,
          nameTr: rug.nameTr,
          nameEn: rug.nameEn,
          descriptionAr: rug.descriptionAr ?? "",
          descriptionTr: rug.descriptionTr ?? "",
          descriptionEn: rug.descriptionEn ?? "",
          categoryId: rug.categoryId,
          isSpecialOffer: rug.isSpecialOffer,
          isNewArrival: rug.isNewArrival,
          isFeatured: rug.isFeatured,
          isActive: rug.isActive,
          images: rug.images.map((img) => ({
            imageUrl: img.imageUrl,
            publicId: img.publicId,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
          })),
        }}
      />
    </div>
  );
}
