"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Card,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  Alert,
  TriLingualLabel,
} from "./form-ui";
import { MultiImageUploader } from "./multi-image-uploader";
import {
  createRug,
  updateRug,
  type RugInput,
  type RugImageInput,
} from "@/app/[locale]/admin/actions";

export type RugFormData = RugInput & { id?: string };

export type CategoryOption = { id: string; name: string };

export function RugForm({
  initial,
  categories,
}: {
  initial?: RugFormData;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [nameTr, setNameTr] = useState(initial?.nameTr ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [descAr, setDescAr] = useState(initial?.descriptionAr ?? "");
  const [descTr, setDescTr] = useState(initial?.descriptionTr ?? "");
  const [descEn, setDescEn] = useState(initial?.descriptionEn ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? ""
  );
  const [isSpecialOffer, setIsSpecialOffer] = useState(
    initial?.isSpecialOffer ?? false
  );
  const [isNewArrival, setIsNewArrival] = useState(
    initial?.isNewArrival ?? false
  );
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [images, setImages] = useState<RugImageInput[]>(initial?.images ?? []);

  function submit() {
    setError(null);
    const payload: RugInput = {
      nameAr,
      nameTr,
      nameEn,
      descriptionAr: descAr,
      descriptionTr: descTr,
      descriptionEn: descEn,
      categoryId,
      isSpecialOffer,
      isNewArrival,
      isFeatured,
      isActive,
      images,
    };

    startTransition(async () => {
      const res = initial?.id
        ? await updateRug(initial.id, payload)
        : await createRug(payload);
      if (res.ok) {
        router.push("/admin/rugs");
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

      {categories.length === 0 && (
        <Alert>يجب إضافة قسم واحد على الأقل قبل إضافة سجادة.</Alert>
      )}

      <Card title="اسم السجادة">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="ar" />
            </span>
            <Input dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="tr" />
            </span>
            <Input dir="ltr" value={nameTr} onChange={(e) => setNameTr(e.target.value)} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="en" />
            </span>
            <Input dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card title="الوصف">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="ar" />
            </span>
            <Textarea dir="rtl" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="tr" />
            </span>
            <Textarea dir="ltr" value={descTr} onChange={(e) => setDescTr(e.target.value)} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm">
              <TriLingualLabel lang="en" />
            </span>
            <Textarea dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card title="القسم">
        <Field label="اختر القسم">
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card title="صور السجادة">
        <MultiImageUploader value={images} onChange={setImages} />
      </Card>

      <Card title="الخيارات">
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox label="عرض خاص" checked={isSpecialOffer} onChange={setIsSpecialOffer} />
          <Checkbox label="وصل حديثًا" checked={isNewArrival} onChange={setIsNewArrival} />
          <Checkbox label="منتج مميز" checked={isFeatured} onChange={setIsFeatured} />
          <Checkbox label="إظهار في الموقع" checked={isActive} onChange={setIsActive} />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending || categories.length === 0}>
          {isPending ? "جارٍ الحفظ..." : initial?.id ? "حفظ التغييرات" : "إضافة السجادة"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/rugs")}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
