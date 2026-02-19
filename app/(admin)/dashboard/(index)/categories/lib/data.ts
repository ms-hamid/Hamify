import { getCategories as dalGetCategories } from "@/lib/dal/categories";

export async function getCategories() {
  return await dalGetCategories();
}
