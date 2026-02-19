import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Brand Name must be at least 2 characters"),
  logo: z.any().optional(), // Can be string (URL) or File (upload)
});

export type TBrand = z.infer<typeof brandSchema>;
