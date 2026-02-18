"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categorySchema, TCategory } from "./schema";

export async function createCategory(data: TCategory) {
  const validation = categorySchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    const existingCategory = await prisma.category.findFirst({
        where: {
            name: data.name,
        }
    })

    if (existingCategory) {
        return {
            error: "Category already exists",
        }
    }

    await prisma.category.create({
      data: {
        name: data.name,
      },
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to create category:", error);
    return {
      error: "Failed to create category. Please try again later.",
    };
  }
}

export async function updateCategory(id: number, data: TCategory) {
  const validation = categorySchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    const existingCategory = await prisma.category.findFirst({
        where: {
            name: data.name,
            NOT: {
              id: id
            }
        }
    })

    if (existingCategory) {
        return {
            error: "Category already exists",
        }
    }

    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to update category:", error);
    return {
      error: "Failed to update category. Please try again later.",
    };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return {
      error: "Failed to delete category. Please try again later.",
    };
  }
}
