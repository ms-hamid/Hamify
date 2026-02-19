import { prisma } from "@/lib/prisma";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        location: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getBrandsForSelect() {
    return await prisma.brand.findMany({ orderBy: { name: 'asc' } });
}

export async function getCategoriesForSelect() {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getLocationsForSelect() {
    return await prisma.location.findMany({ orderBy: { name: 'asc' } });
}
