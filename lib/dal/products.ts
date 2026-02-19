import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products");
  }
});

export const getProductById = cache(async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        location: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product");
  }
});
