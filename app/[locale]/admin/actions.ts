"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { slugify, randomSuffix } from "@/lib/utils";
import {
  UPLOAD_DIR,
  LEGACY_UPLOAD_DIR,
  safePublicId,
} from "@/lib/upload-dir";

const UPLOAD_DIRS = [UPLOAD_DIR, LEGACY_UPLOAD_DIR];

async function deleteFile(publicId: string) {
  const safe = safePublicId(publicId);
  for (const dir of UPLOAD_DIRS) {
    try {
      await unlink(path.join(dir, safe));
    } catch {
      // ignore missing files
    }
  }
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(
  base: string,
  model: "category" | "rug",
  excludeId?: string
): Promise<string> {
  const slug = slugify(base) || model + "-" + randomSuffix();
  let candidate = slug;
  for (let i = 0; i < 50; i++) {
    const existing =
      model === "category"
        ? await prisma.category.findUnique({ where: { slug: candidate } })
        : await prisma.rug.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${slug}-${randomSuffix()}`;
  }
  return `${slug}-${Date.now()}`;
}

export type CategoryInput = {
  nameAr: string;
  nameTr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionTr?: string;
  descriptionEn?: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type RugImageInput = {
  imageUrl: string;
  publicId: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type RugInput = {
  nameAr: string;
  nameTr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionTr?: string;
  descriptionEn?: string;
  categoryId: string;
  isSpecialOffer: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
  images: RugImageInput[];
};

type Result = { ok: true; id: string } | { ok: false; error: string };

function validateNames(input: { nameAr: string; nameTr: string; nameEn: string }) {
  if (!input.nameAr.trim() || !input.nameTr.trim() || !input.nameEn.trim()) {
    return "الاسم مطلوب باللغات الثلاث";
  }
  return null;
}

/* ---------------- Categories ---------------- */

export async function createCategory(input: CategoryInput): Promise<Result> {
  const err = validateNames(input);
  if (err) return { ok: false, error: err };

  const slug = await uniqueSlug(input.nameEn || input.nameAr, "category");
  const category = await prisma.category.create({
    data: {
      nameAr: input.nameAr.trim(),
      nameTr: input.nameTr.trim(),
      nameEn: input.nameEn.trim(),
      descriptionAr: input.descriptionAr?.trim() || null,
      descriptionTr: input.descriptionTr?.trim() || null,
      descriptionEn: input.descriptionEn?.trim() || null,
      slug,
      imageUrl: input.imageUrl || null,
      imagePublicId: input.imagePublicId || null,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });

  revalidateAll();
  return { ok: true, id: category.id };
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<Result> {
  const err = validateNames(input);
  if (err) return { ok: false, error: err };

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "القسم غير موجود" };

  // Clean up the old image if it was replaced or removed.
  if (
    existing.imagePublicId &&
    existing.imagePublicId !== input.imagePublicId
  ) {
    await deleteFile(existing.imagePublicId);
  }

  await prisma.category.update({
    where: { id },
    data: {
      nameAr: input.nameAr.trim(),
      nameTr: input.nameTr.trim(),
      nameEn: input.nameEn.trim(),
      descriptionAr: input.descriptionAr?.trim() || null,
      descriptionTr: input.descriptionTr?.trim() || null,
      descriptionEn: input.descriptionEn?.trim() || null,
      imageUrl: input.imageUrl || null,
      imagePublicId: input.imagePublicId || null,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });

  revalidateAll();
  return { ok: true, id };
}

export async function deleteCategory(id: string): Promise<Result> {
  const count = await prisma.rug.count({ where: { categoryId: id } });
  if (count > 0) {
    return {
      ok: false,
      error: "لا يمكن حذف قسم يحتوي على سجاد. انقل أو احذف السجاد أولًا.",
    };
  }
  const category = await prisma.category.findUnique({ where: { id } });
  if (category?.imagePublicId) await deleteFile(category.imagePublicId);

  await prisma.category.delete({ where: { id } });
  revalidateAll();
  return { ok: true, id };
}

/* ---------------- Rugs ---------------- */

export async function createRug(input: RugInput): Promise<Result> {
  const err = validateNames(input);
  if (err) return { ok: false, error: err };
  if (!input.categoryId) return { ok: false, error: "يجب اختيار القسم" };

  const slug = await uniqueSlug(input.nameEn || input.nameAr, "rug");

  const rug = await prisma.rug.create({
    data: {
      nameAr: input.nameAr.trim(),
      nameTr: input.nameTr.trim(),
      nameEn: input.nameEn.trim(),
      descriptionAr: input.descriptionAr?.trim() || null,
      descriptionTr: input.descriptionTr?.trim() || null,
      descriptionEn: input.descriptionEn?.trim() || null,
      slug,
      categoryId: input.categoryId,
      isSpecialOffer: input.isSpecialOffer,
      isNewArrival: input.isNewArrival,
      isFeatured: input.isFeatured,
      isActive: input.isActive,
      images: {
        create: normalizeImages(input.images),
      },
    },
  });

  revalidateAll();
  return { ok: true, id: rug.id };
}

export async function updateRug(id: string, input: RugInput): Promise<Result> {
  const err = validateNames(input);
  if (err) return { ok: false, error: err };
  if (!input.categoryId) return { ok: false, error: "يجب اختيار القسم" };

  const existing = await prisma.rug.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) return { ok: false, error: "السجادة غير موجودة" };

  // Delete files for images that were removed in the form.
  const keptIds = new Set(input.images.map((i) => i.publicId));
  for (const img of existing.images) {
    if (!keptIds.has(img.publicId)) await deleteFile(img.publicId);
  }

  await prisma.$transaction([
    prisma.rugImage.deleteMany({ where: { rugId: id } }),
    prisma.rug.update({
      where: { id },
      data: {
        nameAr: input.nameAr.trim(),
        nameTr: input.nameTr.trim(),
        nameEn: input.nameEn.trim(),
        descriptionAr: input.descriptionAr?.trim() || null,
        descriptionTr: input.descriptionTr?.trim() || null,
        descriptionEn: input.descriptionEn?.trim() || null,
        categoryId: input.categoryId,
        isSpecialOffer: input.isSpecialOffer,
        isNewArrival: input.isNewArrival,
        isFeatured: input.isFeatured,
        isActive: input.isActive,
        images: { create: normalizeImages(input.images) },
      },
    }),
  ]);

  revalidateAll();
  return { ok: true, id };
}

export async function deleteRug(id: string): Promise<Result> {
  const rug = await prisma.rug.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!rug) return { ok: false, error: "السجادة غير موجودة" };

  for (const img of rug.images) await deleteFile(img.publicId);
  await prisma.rug.delete({ where: { id } });

  revalidateAll();
  return { ok: true, id };
}

/** Create one rug per image under a category (batch upload from dashboard). */
export async function createRugsBatch(input: {
  categoryId: string;
  images: RugImageInput[];
}): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  if (!input.categoryId) return { ok: false, error: "يجب اختيار القسم" };
  if (!input.images.length) return { ok: false, error: "أضف صورة واحدة على الأقل" };

  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) return { ok: false, error: "القسم غير موجود" };

  const existingCount = await prisma.rug.count({
    where: { categoryId: input.categoryId },
  });

  for (let i = 0; i < input.images.length; i++) {
    const img = input.images[i];
    const n = existingCount + i + 1;
    const nameAr = `${category.nameAr} ${n}`;
    const nameTr = `${category.nameTr} ${n}`;
    const nameEn = `${category.nameEn} ${n}`;
    const slug = await uniqueSlug(nameEn, "rug");

    await prisma.rug.create({
      data: {
        nameAr,
        nameTr,
        nameEn,
        slug,
        categoryId: input.categoryId,
        isSpecialOffer: false,
        isNewArrival: true,
        isFeatured: false,
        isActive: true,
        images: {
          create: {
            imageUrl: img.imageUrl,
            publicId: img.publicId,
            sortOrder: 0,
            isPrimary: true,
          },
        },
      },
    });
  }

  revalidateAll();
  return { ok: true, count: input.images.length };
}

export async function deleteRugsBatch(
  ids: string[]
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  if (!ids.length) return { ok: false, error: "لم يتم اختيار أي عنصر" };

  const rugs = await prisma.rug.findMany({
    where: { id: { in: ids } },
    include: { images: true },
  });

  for (const rug of rugs) {
    for (const img of rug.images) await deleteFile(img.publicId);
  }

  const result = await prisma.rug.deleteMany({
    where: { id: { in: ids } },
  });

  revalidateAll();
  return { ok: true, count: result.count };
}

function normalizeImages(images: RugImageInput[]) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const hasPrimary = sorted.some((i) => i.isPrimary);
  return sorted.map((img, index) => ({
    imageUrl: img.imageUrl,
    publicId: img.publicId,
    sortOrder: index,
    isPrimary: hasPrimary ? img.isPrimary : index === 0,
  }));
}
