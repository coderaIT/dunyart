import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { BatchUploadForm } from "@/components/admin/batch-upload-form";

export default async function BatchUploadPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { nameAr: "asc" }],
    select: { id: true, nameAr: true },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-cream">رفع صور دفعة واحدة</h1>
      <p className="mb-6 text-muted">
        اختر أحد الأقسام الثلاثة ثم ارفع عدة صور معًا — كل صورة تُحفظ كقطعة
        جديدة.
      </p>
      <BatchUploadForm
        categories={categories.map((c) => ({ id: c.id, name: c.nameAr }))}
      />
    </div>
  );
}
