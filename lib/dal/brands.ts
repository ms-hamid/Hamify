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
    // Cek apakah logo berubah (ganti gambar ATAU hapus gambar)
    // Kita ambil data lama dulu
    const oldBrand = await prisma.brand.findUnique({
        where: { id },
        select: { logo: true }
    });

    // Jika ada logo lama, DAN logo baru berbeda (bisa URL baru atau string kosong), hapus yang lama
    // Note: data.logo dari Zod schema bisa string kosong "" jika dihapus/tidak ada.
    if (oldBrand?.logo && oldBrand.logo !== data.logo) {
        console.log("DEBUG updateBrand: Deleting old logo", oldBrand.logo);
        await deleteFile(oldBrand.logo);
    }

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

import { deleteFile } from "@/lib/upload";

export async function deleteBrand(id: number) {
  try {
    const brand = await prisma.brand.findUnique({
        where: { id },
        select: { logo: true }
    });

    if (brand?.logo) {
        await deleteFile(brand.logo);
    }

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
