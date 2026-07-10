import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { RugForm } from "@/components/admin/rug-form";

export default async function NewRugPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameAr: "asc" }],
    select: { id: true, nameAr: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-cream">إضافة سجادة جديدة</h1>
      <RugForm
        categories={categories.map((c) => ({ id: c.id, name: c.nameAr }))}
      />
    </div>
  );
}
