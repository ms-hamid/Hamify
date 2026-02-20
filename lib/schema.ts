import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

// Brand Schema
export const brandSchema = z.object({
  name: z.string().min(2, "Brand Name must be at least 2 characters"),
  logo: z
    .any()
    .refine((file) => {
      if (typeof window === "undefined") return true;
      if (file instanceof File) {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }
      return true; // Allow string URL or empty
    }, "Only images (JPEG, PNG, WebP) are allowed")
    .optional(),
});

export type TBrand = z.infer<typeof brandSchema>;

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, "Category Name must be at least 2 characters"),
});

export type TCategory = z.infer<typeof categorySchema>;

// Location Schema
export const locationSchema = z.object({
  name: z.string().min(2, "Location Name must be at least 2 characters"),
});

export type TLocation = z.infer<typeof locationSchema>;

// Product Schema
export const productSchema = z.object({
  name: z.string().min(2, "Product Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.enum(["ready", "preorder"]),
  brandId: z.coerce.number().min(1, "Brand is required"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  locationId: z.coerce.number().min(1, "Location is required"),
  images: z
    .any()
    .refine((files) => {
      if (typeof window === "undefined") return true; 
      if (!files) return true; // Optional
      if (Array.isArray(files)) {
        return files.every((file) => {
            if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
            return typeof file === "string"; // Allow URLs
        });
      }
      // Single file
      if (files instanceof File) return ACCEPTED_IMAGE_TYPES.includes(files.type);
      return typeof files === "string";
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .refine((files) => {
       if (Array.isArray(files)) return files.length <= 4;
       return true; 
    }, "Maximum 4 images allowed.")
    .optional(),
});

export type TProduct = z.infer<typeof productSchema>;

// Order Schema
export const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

export type TOrderStatus = z.infer<typeof orderStatusSchema>;

// Auth Schema
export const schemaSignIn = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TSignIn = z.infer<typeof schemaSignIn>;
