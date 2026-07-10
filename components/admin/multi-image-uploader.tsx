"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadFiles, deleteUploadedFile } from "@/lib/upload-client";
import type { RugImageInput } from "@/app/[locale]/admin/actions";

export function MultiImageUploader({
  value,
  onChange,
}: {
  value: RugImageInput[];
  onChange: (value: RugImageInput[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function commit(next: RugImageInput[]) {
    const reindexed = next.map((img, i) => ({ ...img, sortOrder: i }));
    if (reindexed.length > 0 && !reindexed.some((i) => i.isPrimary)) {
      reindexed[0].isPrimary = true;
    }
    onChange(reindexed);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadFiles(Array.from(files));
      const startLen = value.length;
      const newImages: RugImageInput[] = uploaded.map((u, i) => ({
        imageUrl: u.imageUrl,
        publicId: u.publicId,
        sortOrder: startLen + i,
        isPrimary: false,
      }));
      commit([...value, ...newImages]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ في الرفع");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(index: number) {
    const img = value[index];
    await deleteUploadedFile(img.publicId);
    commit(value.filter((_, i) => i !== index));
  }

  function setPrimary(index: number) {
    commit(value.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((img, index) => (
          <div
            key={img.publicId}
            className={`group relative overflow-hidden rounded-xl border-2 bg-ink-soft ${
              img.isPrimary ? "border-rust" : "border-line"
            }`}
          >
            <div className="relative aspect-square">
              <Image
                src={img.imageUrl}
                alt=""
                fill
                sizes="25vw"
                className="object-cover"
              />
              {img.isPrimary && (
                <span className="absolute top-1.5 start-1.5 rounded-full bg-rust px-2 py-0.5 text-[10px] font-bold text-white">
                  رئيسية
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1 p-1.5">
              <div className="flex gap-1">
                <IconBtn label="تحريك لليمين" onClick={() => move(index, -1)} disabled={index === 0}>
                  ›
                </IconBtn>
                <IconBtn
                  label="تحريك لليسار"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                >
                  ‹
                </IconBtn>
              </div>
              <div className="flex gap-1">
                {!img.isPrimary && (
                  <IconBtn label="تعيين كرئيسية" onClick={() => setPrimary(index)}>
                    ★
                  </IconBtn>
                )}
                <IconBtn label="حذف" onClick={() => remove(index)} danger>
                  ✕
                </IconBtn>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink-soft text-muted transition-colors hover:border-olive hover:text-cream disabled:opacity-50"
        >
          <span className="text-3xl">＋</span>
          <span className="text-xs">{busy ? "جارٍ الرفع..." : "إضافة صور"}</span>
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <p className="mt-3 text-xs text-muted">
        يمكنك اختيار عدة صور دفعة واحدة، تغيير الترتيب بالأسهم، وتحديد الصورة
        الرئيسية بالنجمة (★).
      </p>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold transition-colors disabled:opacity-30 ${
        danger
          ? "bg-red-600/80 text-white hover:bg-red-600"
          : "bg-panel-soft text-cream hover:bg-line"
      }`}
    >
      {children}
    </button>
  );
}
