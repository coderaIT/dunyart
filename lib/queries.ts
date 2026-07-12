import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const rugImageInclude = {
  images: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
  },
} satisfies Prisma.RugInclude;

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { rugs: { where: { isActive: true } } } } },
  });
}

/** Active categories with their rugs (newest first) — for homepage sections. */
export async function getCategoriesWithRugs() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      rugs: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { ...rugImageInclude, category: true },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      rugs: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { ...rugImageInclude, category: true },
      },
    },
  });
}

export async function getSpecialOffers(limit?: number) {
  return prisma.rug.findMany({
    where: { isActive: true, isSpecialOffer: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { ...rugImageInclude, category: true },
  });
}

export async function getNewArrivals(limit?: number) {
  return prisma.rug.findMany({
    where: { isActive: true, isNewArrival: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { ...rugImageInclude, category: true },
  });
}

export async function getFeaturedRugs(limit?: number) {
  return prisma.rug.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { ...rugImageInclude, category: true },
  });
}

export async function getLatestRugs(limit = 8) {
  return prisma.rug.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { ...rugImageInclude, category: true },
  });
}

export async function getRugBySlug(slug: string) {
  return prisma.rug.findUnique({
    where: { slug },
    include: { ...rugImageInclude, category: true },
  });
}

export async function getRelatedRugs(categoryId: string, excludeId: string, limit = 4) {
  return prisma.rug.findMany({
    where: { isActive: true, categoryId, id: { not: excludeId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { ...rugImageInclude, category: true },
  });
}

export async function searchRugs(query: string) {
  const q = query.trim();
  if (!q) return [];
  // SQLite `contains` is case-insensitive for ASCII; good enough here.
  return prisma.rug.findMany({
    where: {
      isActive: true,
      OR: [
        { nameAr: { contains: q } },
        { nameTr: { contains: q } },
        { nameEn: { contains: q } },
        { descriptionAr: { contains: q } },
        { descriptionTr: { contains: q } },
        { descriptionEn: { contains: q } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { ...rugImageInclude, category: true },
  });
}

export type RugWithImages = Awaited<ReturnType<typeof getLatestRugs>>[number];
export type CategoryWithCount = Awaited<
  ReturnType<typeof getActiveCategories>
>[number];
