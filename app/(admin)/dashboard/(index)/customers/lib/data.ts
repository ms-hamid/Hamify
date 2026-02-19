import { prisma } from "@/lib/prisma";

export async function getCustomers() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: 'customer',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers');
  }
}
