import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { TBrand } from "@/lib/schema";

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

export async function createBrand(data: TBrand) {
  try {
    return await prisma.brand.create({
      data: {
        name: data.name,
        logo: data.logo || "",
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create brand");
  }
}

export async function updateBrand(id: number, data: TBrand) {
  try {
    return await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo || "",
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update brand");
  }
}

export async function deleteBrand(id: number) {
  try {
    return await prisma.brand.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete brand");
  }
}

export async function getBrandByName(name: string) {
    return await prisma.brand.findFirst({
        where: { name }
    })
}

export async function getBrandByNameExcludeId(name: string, excludeId: number) {
    return await prisma.brand.findFirst({
        where: { 
            name,
            NOT: { id: excludeId }
        }
    })
}
