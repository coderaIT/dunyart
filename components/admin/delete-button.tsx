"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteCategory, deleteRug } from "@/app/[locale]/admin/actions";

export function DeleteButton({
  type,
  id,
  name,
}: {
  type: "category" | "rug";
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    const label = type === "category" ? "القسم" : "السجادة";
    if (!confirm(`هل تريد حذف ${label}: «${name}»؟`)) return;
    setError(null);
    startTransition(async () => {
      const res =
        type === "category" ? await deleteCategory(id) : await deleteRug(id);
      if (res.ok) {
        router.refresh();
      } else {
        setError(res.error);
        alert(res.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      title={error ?? "حذف"}
      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
    >
      {isPending ? "..." : "حذف"}
    </button>
  );
}
