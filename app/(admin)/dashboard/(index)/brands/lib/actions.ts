"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { brandSchema, TBrand } from "./schema";

export async function createBrand(data: TBrand) {
  const validation = brandSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    const existingBrand = await prisma.brand.findFirst({
        where: {
            name: data.name,
        }
    })

    if (existingBrand) {
        return {
            error: "Brand already exists",
        }
    }

    await prisma.brand.create({
      data: {
        name: data.name,
        logo: data.logo || "",
      },
    });

    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    console.error("Failed to create brand:", error);
    return {
      error: "Failed to create brand. Please try again later.",
    };
  }
}

export async function updateBrand(id: number, data: TBrand) {
  const validation = brandSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    const existingBrand = await prisma.brand.findFirst({
        where: {
            name: data.name,
            NOT: {
              id: id
            }
        }
    })

    if (existingBrand) {
        return {
            error: "Brand already exists",
        }
    }

    await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo || "",
      },
    });

    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    console.error("Failed to update brand:", error);
    return {
      error: "Failed to update brand. Please try again later.",
    };
  }
}

export async function deleteBrand(id: number) {
  try {
    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete brand:", error);
    return {
      error: "Failed to delete brand. Please try again later.",
    };
  }
}
