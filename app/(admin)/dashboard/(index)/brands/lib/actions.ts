"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { brandSchema, TBrand } from "@/lib/schema";
import { createBrand as dalCreateBrand, updateBrand as dalUpdateBrand, deleteBrand as dalDeleteBrand } from "@/lib/dal/brands";

export async function createBrand(data: TBrand) {
  const result = brandSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalCreateBrand(data);
    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to create brand",
    };
  }
}

export async function updateBrand(id: number, data: TBrand) {
  const result = brandSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalUpdateBrand(id, data);
    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to update brand",
    };
  }
}

export async function deleteBrand(id: number) {
  try {
    await dalDeleteBrand(id);
    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete brand",
    };
  }
}
