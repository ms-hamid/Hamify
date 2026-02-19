import { prisma } from "@/lib/prisma";

export async function getLocations() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return locations;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch locations');
  }
}
