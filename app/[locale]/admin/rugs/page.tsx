import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/delete-button";

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">السجاد</h1>
          <p className="mt-1 text-sm text-muted">{rugs.length} سجادة</p>
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

      {rugs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-panel/40 p-16 text-center text-muted">
          لا يوجد سجاد بعد. ابدأ بإضافة سجادة جديدة.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-panel-soft text-xs uppercase text-muted">
              <tr>
                <th className="p-3 text-start font-medium">السجادة</th>
                <th className="p-3 text-start font-medium">القسم</th>
                <th className="p-3 text-start font-medium">الوسوم</th>
                <th className="p-3 text-start font-medium">الحالة</th>
                <th className="p-3 text-start font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rugs.map((rug) => (
                <tr key={rug.id} className="bg-panel">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-soft">
                        {rug.images[0] ? (
                          <Image
                            src={rug.images[0].imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-semibold text-cream">{rug.nameAr}</div>
                        <div className="text-xs text-muted">
                          {rug.images.length} صورة
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-cream-soft">{rug.category.nameAr}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {rug.isSpecialOffer && <Tag className="bg-rust/20 text-rust-soft">عرض</Tag>}
                      {rug.isNewArrival && <Tag className="bg-olive/20 text-olive-soft">حديث</Tag>}
                      {rug.isFeatured && <Tag className="bg-sand/20 text-sand">مميز</Tag>}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        rug.isActive ? "bg-olive/20 text-olive-soft" : "bg-line text-muted"
                      }`}
                    >
                      {rug.isActive ? "ظاهر" : "مخفي"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={{ pathname: "/admin/rugs/[id]", params: { id: rug.id } }}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:border-olive"
                      >
                        تعديل
                      </Link>
                      <DeleteButton type="rug" id={rug.id} name={rug.nameAr} />
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

function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}
