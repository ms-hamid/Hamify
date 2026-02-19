import {
  getProducts as dalGetProducts,
} from "@/lib/dal/products";
import { getBrandsList } from "@/lib/dal/brands";
import { getCategoriesList } from "@/lib/dal/categories";
import { getLocationsList } from "@/lib/dal/locations";

export async function getProducts() {
  return await dalGetProducts();
}

export async function getBrandsForSelect() {
  return await getBrandsList();
}

export async function getCategoriesForSelect() {
  return await getCategoriesList();
}

export async function getLocationsForSelect() {
  return await getLocationsList();
}
