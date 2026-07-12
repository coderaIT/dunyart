import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, rugs, offers, arrivals, featured] = await Promise.all([
    prisma.category.count(),
    prisma.rug.count(),
    prisma.rug.count({ where: { isSpecialOffer: true } }),
    prisma.rug.count({ where: { isNewArrival: true } }),
    prisma.rug.count({ where: { isFeatured: true } }),
  ]);

  const stats = [
    { label: "الأقسام", value: categories },
    { label: "السجاد", value: rugs },
    { label: "عروض خاصة", value: offers },
    { label: "وصل حديثًا", value: arrivals },
    { label: "منتجات مميزة", value: featured },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-cream">لوحة التحكم</h1>
      <p className="mt-1 text-muted">نظرة عامة على المحتوى وإدارته.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-panel p-5"
          >
            <div className="text-3xl font-bold text-sand">{s.value}</div>
            <div className="mt-1 text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/rugs/batch"
          className="group rounded-2xl border border-rust/40 bg-panel p-6 transition-colors hover:border-rust"
        >
          <div className="text-lg font-semibold text-cream group-hover:text-sand">
            + رفع صور دفعة واحدة
          </div>
          <p className="mt-1 text-sm text-muted">
            اختر قسمًا (عصري / كلاسيكي / عجمي) وارفع عدة صور معًا.
          </p>
        </Link>
        <Link
          href="/admin/rugs/new"
          className="group rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-olive"
        >
          <div className="text-lg font-semibold text-cream group-hover:text-sand">
            + إضافة سجادة جديدة
          </div>
          <p className="mt-1 text-sm text-muted">
            أضف سجادة مع عدة صور وحدد الصورة الرئيسية والترتيب.
          </p>
        </Link>
        <Link
          href="/admin/categories"
          className="group rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-olive"
        >
          <div className="text-lg font-semibold text-cream group-hover:text-sand">
            إدارة الأقسام
          </div>
          <p className="mt-1 text-sm text-muted">
            الأقسام الثلاثة: عصري، كلاسيكي، عجمي — مع الترجمات.
          </p>
        </Link>
      </div>
    </div>
  );
}
