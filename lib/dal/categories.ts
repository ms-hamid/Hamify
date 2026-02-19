import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories");
  }
});

export const getCategoriesList = cache(async () => {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories list");
  }
});
