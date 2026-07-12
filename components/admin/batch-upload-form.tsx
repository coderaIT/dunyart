"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Card,
  Field,
  Select,
  Button,
  Alert,
} from "./form-ui";
import { MultiImageUploader } from "./multi-image-uploader";
import {
  createRugsBatch,
  type RugImageInput,
} from "@/app/[locale]/admin/actions";
import type { CategoryOption } from "./rug-form";

export function BatchUploadForm({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [images, setImages] = useState<RugImageInput[]>([]);

  function submit() {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await createRugsBatch({ categoryId, images });
      if (res.ok) {
        setSuccess(`تم إضافة ${res.count} صورة بنجاح.`);
        setImages([]);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-6"
    >
      {error && <Alert>{error}</Alert>}
      {success && (
        <div className="rounded-xl border border-olive/40 bg-olive/10 px-4 py-3 text-sm text-olive-soft">
          {success}
        </div>
      )}

      {categories.length === 0 && (
        <Alert>يجب إضافة قسم واحد على الأقل قبل رفع الصور.</Alert>
      )}

      <Card title="القسم">
        <Field label="اختر القسم">
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <p className="mt-2 text-xs text-muted">
          كل صورة تُضاف كقطعة جديدة في القسم المختار، وتظهر تلقائيًا في قسم
          «أحدث المضاف».
        </p>
      </Card>

      <Card title="الصور (دفعة واحدة)">
        <MultiImageUploader value={images} onChange={setImages} />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending || !categoryId || images.length === 0}>
          {isPending ? "جارٍ الحفظ..." : `حفظ ${images.length || ""} صورة`}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/rugs")}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
