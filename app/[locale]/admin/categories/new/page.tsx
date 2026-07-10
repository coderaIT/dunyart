import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NewCategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-cream">إضافة قسم جديد</h1>
      <CategoryForm />
    </div>
  );
}
