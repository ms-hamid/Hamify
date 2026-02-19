import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { TCategory } from "@/lib/schema";

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

export async function createCategory(data: TCategory) {
  try {
    return await prisma.category.create({
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(id: number, data: TCategory) {
  try {
    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(id: number) {
  try {
    return await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete category");
  }
}

export async function getCategoryByName(name: string) {
    return await prisma.category.findFirst({
        where: { name }
    })
}

export async function getCategoryByNameExcludeId(name: string, excludeId: number) {
    return await prisma.category.findFirst({
        where: { 
            name,
            NOT: { id: excludeId }
        }
    })
}
