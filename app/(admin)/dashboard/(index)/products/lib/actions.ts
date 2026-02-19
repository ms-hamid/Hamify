"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { productSchema, TProduct } from "./schema";

export async function createProduct(data: TProduct) {
  const validation = productSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price, // BigInt handling might be needed if not handled by prisma client automatically from number
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        locationId: data.locationId,
        images: data.images ? [data.images] : [], // Handling single image URL as array
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return {
      error: "Failed to create product. Please try again later.",
    };
  }
}

export async function updateProduct(id: number, data: TProduct) {
  const validation = productSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        locationId: data.locationId,
        images: data.images ? [data.images] : [],
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return {
      error: "Failed to update product. Please try again later.",
    };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      error: "Failed to delete product. Please try again later.",
    };
  }
}
