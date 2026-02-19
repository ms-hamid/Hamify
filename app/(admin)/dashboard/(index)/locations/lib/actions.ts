"use server";

import { revalidatePath } from "next/cache";
import { locationSchema, TLocation } from "@/lib/schema";
import { createLocation as dalCreateLocation, updateLocation as dalUpdateLocation, deleteLocation as dalDeleteLocation } from "@/lib/dal/locations";

export async function createLocation(data: TLocation) {
  const result = locationSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalCreateLocation(data);
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to create location",
    };
  }
}

export async function updateLocation(id: number, data: TLocation) {
  const result = locationSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalUpdateLocation(id, data);
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to update location",
    };
  }
}

export async function deleteLocation(id: number) {
  try {
    await dalDeleteLocation(id);
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete location",
    };
  }
}
