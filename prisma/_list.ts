import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const rugs = await prisma.rug.findMany({
    select: { slug: true, nameAr: true, images: { select: { imageUrl: true } } },
  });
  console.log(JSON.stringify(rugs, null, 2));
}
main().finally(() => prisma.$disconnect());
