import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(2, "Location Name must be at least 2 characters"),
});

export type TLocation = z.infer<typeof locationSchema>;
