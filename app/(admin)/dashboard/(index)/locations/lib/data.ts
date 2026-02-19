import { getLocations as dalGetLocations } from "@/lib/dal/locations";

export async function getLocations() {
  return await dalGetLocations();
}
