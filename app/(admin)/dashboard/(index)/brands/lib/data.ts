import { prisma } from "@/lib/prisma";

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return brands;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch brands');
  }
}
