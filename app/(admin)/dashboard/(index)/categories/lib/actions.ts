"use server";

import { revalidatePath } from "next/cache";
import { categorySchema, TCategory } from "@/lib/schema";
import { createCategory as dalCreateCategory, updateCategory as dalUpdateCategory, deleteCategory as dalDeleteCategory } from "@/lib/dal/categories";

export async function createCategory(data: TCategory) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalCreateCategory(data);
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to create category",
    };
  }
}

export async function updateCategory(id: number, data: TCategory) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalUpdateCategory(id, data);
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to update category",
    };
  }
}

export async function deleteCategory(id: number) {
  try {
    await dalDeleteCategory(id);
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete category",
    };
  }
}
