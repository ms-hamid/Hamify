import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"), // Handle as number in form, convert to BigInt in action
  stock: z.enum(["ready", "preorder"]),
  brandId: z.coerce.number().min(1, "Brand is required"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  locationId: z.coerce.number().min(1, "Location is required"),
  images: z
    .any()
    .refine((file) => {
      if (typeof window === "undefined") return true; // Skip on server if needed, though Zod is usually shared
      if (file instanceof File) {
        return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type);
      }
      return true; // Allow string URL or empty
    }, "Only images (JPEG, PNG, WebP) are allowed")
    .optional(),
});

export type TProduct = z.infer<typeof productSchema>;
