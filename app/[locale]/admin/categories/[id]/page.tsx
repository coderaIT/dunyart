import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-cream">تعديل القسم</h1>
      <CategoryForm
        initial={{
          id: category.id,
          nameAr: category.nameAr,
          nameTr: category.nameTr,
          nameEn: category.nameEn,
          descriptionAr: category.descriptionAr ?? "",
          descriptionTr: category.descriptionTr ?? "",
          descriptionEn: category.descriptionEn ?? "",
          imageUrl: category.imageUrl,
          imagePublicId: category.imagePublicId,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
        }}
      />
    </div>
  );
}
