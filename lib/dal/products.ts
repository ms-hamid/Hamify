import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { TProduct } from "@/lib/schema";

export const getProducts = cache(async () => {
    try {
        const products = await prisma.product.findMany({
            include: {
                brand: true,
                category: true,
                location: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return products;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch products");
    }
});

export const getProductById = cache(async (id: number) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                brand: true,
                category: true,
                location: true
            }
        });
        return product;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch product");
    }
});

export async function createProduct(data: TProduct) {
  try {
    return await prisma.product.create({
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(id: number, data: TProduct) {
  try {
    return await prisma.product.update({
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: number) {
  try {
    return await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product");
  }
}
