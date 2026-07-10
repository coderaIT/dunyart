"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadFiles, deleteUploadedFile } from "@/lib/upload-client";

export type SingleImageValue = { imageUrl: string; publicId: string } | null;

export function SingleImageUploader({
  value,
  onChange,
}: {
  value: SingleImageValue;
  onChange: (value: SingleImageValue) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const [uploaded] = await uploadFiles([files[0]]);
      if (value?.publicId) await deleteUploadedFile(value.publicId);
      onChange(uploaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (value?.publicId) await deleteUploadedFile(value.publicId);
    onChange(null);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-line">
          <div className="relative aspect-4/3">
            <Image
              src={value.imageUrl}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 p-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex-1 rounded-lg bg-panel-soft py-1.5 text-xs font-medium text-cream hover:bg-line"
            >
              تغيير
            </button>
            <button
              type="button"
              onClick={remove}
              className="flex-1 rounded-lg bg-red-600/80 py-1.5 text-xs font-medium text-white hover:bg-red-600"
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-4/3 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink-soft text-muted transition-colors hover:border-olive hover:text-cream disabled:opacity-50"
        >
          <UploadIcon />
          <span className="text-sm">{busy ? "جارٍ الرفع..." : "اختر صورة"}</span>
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}
