import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { rugs: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">الأقسام</h1>
          <p className="mt-1 text-sm text-muted">
            {categories.length} قسم
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-rust px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rust-soft"
        >
          + إضافة قسم
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-panel/40 p-16 text-center text-muted">
          لا توجد أقسام بعد. ابدأ بإضافة قسم جديد.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-panel-soft text-start text-xs uppercase text-muted">
              <tr>
                <th className="p-3 text-start font-medium">القسم</th>
                <th className="p-3 text-start font-medium">عدد السجاد</th>
                <th className="p-3 text-start font-medium">الترتيب</th>
                <th className="p-3 text-start font-medium">الحالة</th>
                <th className="p-3 text-start font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((c) => (
                <tr key={c.id} className="bg-panel">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-soft">
                        {c.imageUrl ? (
                          <Image src={c.imageUrl} alt="" fill className="object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-semibold text-cream">{c.nameAr}</div>
                        <div className="text-xs text-muted">
                          {c.nameEn} · {c.nameTr}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-cream-soft">{c._count.rugs}</td>
                  <td className="p-3 text-cream-soft">{c.sortOrder}</td>
                  <td className="p-3">
                    <StatusBadge active={c.isActive} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={{ pathname: "/admin/categories/[id]", params: { id: c.id } }}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:border-olive"
                      >
                        تعديل
                      </Link>
                      <DeleteButton type="category" id={c.id} name={c.nameAr} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? "bg-olive/20 text-olive-soft" : "bg-line text-muted"
      }`}
    >
      {active ? "ظاهر" : "مخفي"}
    </span>
  );
}
