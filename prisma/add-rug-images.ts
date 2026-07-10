import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rugs = [
  {
    slug: "colorful-geometric-rug",
    categorySlug: "modern-rugs",
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
    publicId: "1.jpeg",
    isNewArrival: true,
    isFeatured: true,
  },
  {
    slug: "gold-botanical-rug",
    categorySlug: "modern-rugs",
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
    publicId: "2.jpeg",
    isSpecialOffer: true,
    isFeatured: true,
  },
  {
    slug: "vintage-teal-rug",
    categorySlug: "classic-rugs",
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
    publicId: "3.jpeg",
    isNewArrival: true,
    isSpecialOffer: true,
  },
];

async function main() {
  for (const rug of rugs) {
    const category = await prisma.category.findUnique({
      where: { slug: rug.categorySlug },
    });
    if (!category) {
      console.warn(`Category not found: ${rug.categorySlug}, skipping ${rug.slug}`);
      continue;
    }

    const existing = await prisma.rug.findUnique({ where: { slug: rug.slug } });

    if (existing) {
      await prisma.rugImage.deleteMany({ where: { rugId: existing.id } });
      await prisma.rug.update({
        where: { id: existing.id },
        data: {
          nameAr: rug.nameAr,
          nameTr: rug.nameTr,
          nameEn: rug.nameEn,
          descriptionAr: rug.descriptionAr,
          descriptionTr: rug.descriptionTr,
          descriptionEn: rug.descriptionEn,
          categoryId: category.id,
          isNewArrival: rug.isNewArrival ?? false,
          isSpecialOffer: rug.isSpecialOffer ?? false,
          isFeatured: rug.isFeatured ?? false,
          isActive: true,
          images: {
            create: {
              imageUrl: rug.imageUrl,
              publicId: rug.publicId,
              sortOrder: 0,
              isPrimary: true,
            },
          },
        },
      });
      console.log(`Updated: ${rug.nameAr}`);
    } else {
      await prisma.rug.create({
        data: {
          nameAr: rug.nameAr,
          nameTr: rug.nameTr,
          nameEn: rug.nameEn,
          descriptionAr: rug.descriptionAr,
          descriptionTr: rug.descriptionTr,
          descriptionEn: rug.descriptionEn,
          slug: rug.slug,
          categoryId: category.id,
          isNewArrival: rug.isNewArrival ?? false,
          isSpecialOffer: rug.isSpecialOffer ?? false,
          isFeatured: rug.isFeatured ?? false,
          isActive: true,
          images: {
            create: {
              imageUrl: rug.imageUrl,
              publicId: rug.publicId,
              sortOrder: 0,
              isPrimary: true,
            },
          },
        },
      });
      console.log(`Created: ${rug.nameAr}`);
    }
  }

  console.log("Done — 3 rugs with images added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
