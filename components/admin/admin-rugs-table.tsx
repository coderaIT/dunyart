"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { deleteRug, deleteRugsBatch } from "@/app/[locale]/admin/actions";
import { MediaImage } from "@/components/media-image";

export type AdminRugRow = {
  id: string;
  nameAr: string;
  isSpecialOffer: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
  categoryName: string;
  imageUrl: string | null;
  imageCount: number;
};

export function AdminRugsTable({ rugs }: { rugs: AdminRugRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allIds = useMemo(() => rugs.map((r) => r.id), [rugs]);
  const allSelected = rugs.length > 0 && selected.size === rugs.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds));
  }

  function deleteOne(id: string, name: string) {
    if (!confirm(`هل تريد حذف السجادة: «${name}»؟`)) return;
    startTransition(async () => {
      const res = await deleteRug(id);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      router.refresh();
    });
  }

  function deleteSelected() {
    const ids = [...selected];
    if (!ids.length) return;
    if (!confirm(`هل تريد حذف ${ids.length} عنصرًا نهائيًا؟`)) return;
    startTransition(async () => {
      const res = await deleteRugsBatch(ids);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      setSelected(new Set());
      router.refresh();
    });
  }

  if (rugs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-panel/40 p-16 text-center text-muted">
        لا يوجد سجاد بعد. ابدأ برفع صور دفعة واحدة أو إضافة سجادة جديدة.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-cream">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-rust"
          />
          تحديد الكل ({rugs.length})
        </label>

        <button
          type="button"
          onClick={deleteSelected}
          disabled={isPending || selected.size === 0}
          className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-40"
        >
          {isPending
            ? "جارٍ الحذف..."
            : selected.size > 0
              ? `حذف المحدد (${selected.size})`
              : "حذف المحدد"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-panel-soft text-xs uppercase text-muted">
            <tr>
              <th className="w-10 p-3" />
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
                  <input
                    type="checkbox"
                    checked={selected.has(rug.id)}
                    onChange={() => toggle(rug.id)}
                    className="h-4 w-4 accent-rust"
                    aria-label={`تحديد ${rug.nameAr}`}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-soft">
                      {rug.imageUrl ? (
                        <MediaImage
                          src={rug.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <Image
                          src="/logo.png"
                          alt=""
                          width={28}
                          height={28}
                          className="m-auto mt-2 opacity-30"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-cream">{rug.nameAr}</div>
                      <div className="text-xs text-muted">
                        {rug.imageCount} صورة
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-cream-soft">{rug.categoryName}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {rug.isSpecialOffer && (
                      <Tag className="bg-rust/20 text-rust-soft">عرض</Tag>
                    )}
                    {rug.isNewArrival && (
                      <Tag className="bg-olive/20 text-olive-soft">حديث</Tag>
                    )}
                    {rug.isFeatured && (
                      <Tag className="bg-sand/20 text-sand">مميز</Tag>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      rug.isActive
                        ? "bg-olive/20 text-olive-soft"
                        : "bg-line text-muted"
                    }`}
                  >
                    {rug.isActive ? "ظاهر" : "مخفي"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={{
                        pathname: "/admin/rugs/[id]",
                        params: { id: rug.id },
                      }}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:border-olive"
                    >
                      تعديل
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteOne(rug.id, rug.nameAr)}
                      disabled={isPending}
                      className="rounded-lg border border-red-500/50 bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
