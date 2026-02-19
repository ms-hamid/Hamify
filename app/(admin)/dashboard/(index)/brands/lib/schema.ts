import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Brand Name must be at least 2 characters"),
  logo: z
    .any()
    .refine((file) => {
      if (typeof window === "undefined") return true;
      if (file instanceof File) {
        return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type);
      }
      return true; // Allow string URL or empty
    }, "Only images (JPEG, PNG, WebP) are allowed")
    .optional(),
});

export type TBrand = z.infer<typeof brandSchema>;
