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
