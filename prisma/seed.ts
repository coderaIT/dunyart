import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categories = [
  {
    nameAr: "سجاد عصري",
    nameTr: "Modern Halılar",
    nameEn: "Modern Rugs",
    descriptionAr: "تصاميم عصرية بألوان وأنماط تناسب المساحات الحديثة.",
    descriptionTr: "Modern mekanlara uygun renk ve desenlerle çağdaş tasarımlar.",
    descriptionEn: "Contemporary designs with colors and patterns that suit modern spaces.",
    sortOrder: 1,
  },
  {
    nameAr: "سجاد كلاسيكي",
    nameTr: "Klasik Halılar",
    nameEn: "Classic Rugs",
    descriptionAr: "سجاد كلاسيكي أنيق بزخارف تقليدية خالدة.",
    descriptionTr: "Zamansız geleneksel motiflere sahip zarif klasik halılar.",
    descriptionEn: "Elegant classic rugs with timeless traditional motifs.",
    sortOrder: 2,
  },
  {
    nameAr: "سجاد عجمي",
    nameTr: "Acem Halıları",
    nameEn: "Persian Rugs",
    descriptionAr: "سجاد عجمي يدوي فاخر بتصاميم فارسية عريقة.",
    descriptionTr: "Köklü Fars tasarımlarına sahip lüks el yapımı Acem halıları.",
    descriptionEn: "Luxurious handmade Persian rugs with heritage Persian designs.",
    sortOrder: 3,
  },
];

type RugSeed = {
  nameAr: string;
  nameTr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionTr: string;
  descriptionEn: string;
  isSpecialOffer?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  imagePublicId?: string;
};

const rugsByCategory: Record<string, RugSeed[]> = {
  "modern-rugs": [
    {
      nameAr: "سجادة هندسية ملونة",
      nameTr: "Renkli Geometrik Halı",
      nameEn: "Colorful Geometric Rug",
      descriptionAr:
        "سجادة عصرية بأنماط هندسية وزخارف ملونة نابضة بالحياة، مثالية للمساحات العصرية.",
      descriptionTr:
        "Canlı renkli geometrik desenlere sahip modern halı, çağdaş mekanlar için ideal.",
      descriptionEn:
        "A modern rug with vibrant geometric patterns and colorful motifs, ideal for contemporary spaces.",
      imageUrl: "/1.jpeg",
      imagePublicId: "1.jpeg",
      isNewArrival: true,
      isFeatured: true,
    },
    {
      nameAr: "سجادة أوراق ذهبية",
      nameTr: "Altın Yaprak Desenli Halı",
      nameEn: "Gold Botanical Rug",
      descriptionAr:
        "تصميم عصري بأوراق استوائية بلمسات ذهبية أنيقة، يضيف فخامة لأي غرفة معيشة.",
      descriptionTr:
        "Zarif altın dokunuşlu tropikal yaprak desenli modern tasarım, her oturma odasına lüks katar.",
      descriptionEn:
        "A contemporary design with tropical leaf motifs and elegant gold accents, adding luxury to any living room.",
      imageUrl: "/2.jpeg",
      imagePublicId: "2.jpeg",
      isSpecialOffer: true,
      isFeatured: true,
    },
  ],
  "classic-rugs": [
    {
      nameAr: "سجادة كلاسيكية عتيقة",
      nameTr: "Antika Klasik Halı",
      nameEn: "Vintage Classic Rug",
      descriptionAr:
        "سجادة كلاسيكية بطابع عتيق مع لمسات تركوازية، تجمع بين الأناقة التقليدية والحداثة.",
      descriptionTr:
        "Turkuaz dokunuşlu antika tarzı klasik halı, geleneksel zarafet ile modernliği birleştirir.",
      descriptionEn:
        "A classic rug with a vintage look and teal accents, blending traditional elegance with modern style.",
      imageUrl: "/3.jpeg",
      imagePublicId: "3.jpeg",
      isNewArrival: true,
      isSpecialOffer: true,
    },
  ],
  "persian-rugs": [],
};

async function main() {
  console.log("Seeding database...");

  // Reset existing content so the category list matches exactly.
  await prisma.rugImage.deleteMany();
  await prisma.rug.deleteMany();
  await prisma.category.deleteMany();

  for (const cat of categories) {
    const slug = slugify(cat.nameEn);
    const category = await prisma.category.create({
      data: { ...cat, slug, isActive: true },
    });

    const rugs = rugsByCategory[slug] ?? [];
    for (const rug of rugs) {
      const rugSlug = slugify(rug.nameEn);
      await prisma.rug.create({
        data: {
          nameAr: rug.nameAr,
          nameTr: rug.nameTr,
          nameEn: rug.nameEn,
          descriptionAr: rug.descriptionAr,
          descriptionTr: rug.descriptionTr,
          descriptionEn: rug.descriptionEn,
          slug: rugSlug,
          isSpecialOffer: rug.isSpecialOffer ?? false,
          isNewArrival: rug.isNewArrival ?? false,
          isFeatured: rug.isFeatured ?? false,
          isActive: true,
          categoryId: category.id,
          ...(rug.imageUrl && rug.imagePublicId
            ? {
                images: {
                  create: {
                    imageUrl: rug.imageUrl,
                    publicId: rug.imagePublicId,
                    sortOrder: 0,
                    isPrimary: true,
                  },
                },
              }
            : {}),
        },
      });
    }
  }

  console.log("Seeding complete: 3 categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
