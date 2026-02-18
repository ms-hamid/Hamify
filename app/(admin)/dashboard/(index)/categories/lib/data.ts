import { prisma } from '@/lib/prisma'; // Assuming lib/prisma exists, I should check this.
import { Category } from '@prisma/client';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories');
  }
}
