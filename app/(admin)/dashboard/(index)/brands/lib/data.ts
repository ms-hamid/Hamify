import { getBrands as dalGetBrands } from "@/lib/dal/brands";

export async function getBrands() {
  return await dalGetBrands();
}
