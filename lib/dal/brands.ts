import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getBrands = cache(async () => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return brands;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch brands");
  }
});

export const getBrandsList = cache(async () => {
  try {
    return await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch brands list");
  }
});
