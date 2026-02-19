"use server";

import { revalidatePath } from "next/cache";
import { productSchema, TProduct } from "@/lib/schema";
import { createProduct as dalCreateProduct, updateProduct as dalUpdateProduct, deleteProduct as dalDeleteProduct } from "@/lib/dal/products";

export async function createProduct(data: TProduct) {
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalCreateProduct(data);
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to create product",
    };
  }
}

export async function updateProduct(id: number, data: TProduct) {
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalUpdateProduct(id, data);
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to update product",
    };
  }
}

export async function deleteProduct(id: number) {
  try {
    await dalDeleteProduct(id);
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete product",
    };
  }
}
