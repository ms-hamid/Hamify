"use server";

import { revalidatePath } from "next/cache";
import { productSchema, TProduct } from "@/lib/schema";
import { createProduct as dalCreateProduct, updateProduct as dalUpdateProduct, deleteProduct as dalDeleteProduct } from "@/lib/dal/products";
import { uploadFile } from "@/lib/upload";

async function processImages(images: any): Promise<string[]> {
    const imageUrls: string[] = [];
    
    if (!images) return [];
    
    // Normalize to array
    const imageList = Array.isArray(images) ? images : [images];

    for (const image of imageList) {
        if (image instanceof File) {
            const formData = new FormData();
            formData.append("file", image);
            const { url, error } = await uploadFile(formData);
            if (url) {
                imageUrls.push(url);
            } else {
                throw new Error(error || "Failed to upload image");
            }
        } else if (typeof image === "string") {
            imageUrls.push(image);
        }
    }
    
    return imageUrls;
}

export async function createProduct(data: TProduct) {
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    const imageUrls = await processImages(data.images);
    // Explicitly cast or construct object to satisfy type if needed, but TProduct.images is any/string[] mixed in our logical flow
    // We update data.images to be string[] for the DAL
    const productData = { ...data, images: imageUrls };
    
    await dalCreateProduct(productData);
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create product",
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
    const imageUrls = await processImages(data.images);
    const productData = { ...data, images: imageUrls };

    await dalUpdateProduct(id, productData);
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update product",
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
      error: error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
