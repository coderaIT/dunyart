"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Card,
  Field,
  Input,
  Textarea,
  Checkbox,
  Button,
  Alert,
  TriLingualLabel,
} from "./form-ui";
import {
  SingleImageUploader,
  type SingleImageValue,
} from "./single-image-uploader";
import {
  createCategory,
  updateCategory,
  type CategoryInput,
} from "@/app/[locale]/admin/actions";

export type CategoryFormData = CategoryInput & { id?: string };

export function CategoryForm({ initial }: { initial?: CategoryFormData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [nameTr, setNameTr] = useState(initial?.nameTr ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [descAr, setDescAr] = useState(initial?.descriptionAr ?? "");
  const [descTr, setDescTr] = useState(initial?.descriptionTr ?? "");
  const [descEn, setDescEn] = useState(initial?.descriptionEn ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [image, setImage] = useState<SingleImageValue>(
    initial?.imageUrl && initial?.imagePublicId
      ? { imageUrl: initial.imageUrl, publicId: initial.imagePublicId }
      : null
  );

  function submit() {
    setError(null);
    const payload: CategoryInput = {
      nameAr,
      nameTr,
      nameEn,
      descriptionAr: descAr,
      descriptionTr: descTr,
      descriptionEn: descEn,
      imageUrl: image?.imageUrl ?? null,
      imagePublicId: image?.publicId ?? null,
      sortOrder: Number(sortOrder) || 0,
      isActive,
    };

    startTransition(async () => {
      const res = initial?.id
        ? await updateCategory(initial.id, payload)
        : await createCategory(payload);
      if (res.ok) {
        router.push("/admin/categories");
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

      <Card title="الاسم">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={""}>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="ar" />
            </span>
            <Input
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="السجاد الفارسي"
            />
          </Field>
          <Field label={""}>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="tr" />
            </span>
            <Input
              dir="ltr"
              value={nameTr}
              onChange={(e) => setNameTr(e.target.value)}
              placeholder="İran Halıları"
            />
          </Field>
          <Field label={""}>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="en" />
            </span>
            <Input
              dir="ltr"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Persian Rugs"
            />
          </Field>
        </div>
      </Card>

      <Card title="الوصف">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={""}>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="ar" />
            </span>
            <Textarea dir="rtl" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
          </Field>
          <Field label={""}>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="tr" />
            </span>
            <Textarea dir="ltr" value={descTr} onChange={(e) => setDescTr(e.target.value)} />
          </Field>
          <Field label={""}>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="en" />
            </span>
            <Textarea dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="الصورة والإعدادات">
        <Field label="صورة الكاتيجوري">
          <SingleImageUploader value={image} onChange={setImage} />
        </Field>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="ترتيب الظهور" hint="الأصغر يظهر أولًا">
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </Field>
          <div className="flex items-end">
            <div className="w-full">
              <Checkbox
                label="إظهار القسم في الموقع"
                checked={isActive}
                onChange={setIsActive}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "جارٍ الحفظ..." : initial?.id ? "حفظ التغييرات" : "إضافة القسم"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/categories")}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
