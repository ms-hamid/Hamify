"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { locationSchema, TLocation } from "./schema";

export async function createLocation(data: TLocation) {
  const validation = locationSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    const existingLocation = await prisma.location.findFirst({
        where: {
            name: data.name,
        }
    })

    if (existingLocation) {
        return {
            error: "Location already exists",
        }
    }

    await prisma.location.create({
      data: {
        name: data.name,
      },
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Failed to create location:", error);
    return {
      error: "Failed to create location. Please try again later.",
    };
  }
}

export async function updateLocation(id: number, data: TLocation) {
  const validation = locationSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    const existingLocation = await prisma.location.findFirst({
        where: {
            name: data.name,
            NOT: {
              id: id
            }
        }
    })

    if (existingLocation) {
        return {
            error: "Location already exists",
        }
    }

    await prisma.location.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Failed to update location:", error);
    return {
      error: "Failed to update location. Please try again later.",
    };
  }
}

export async function deleteLocation(id: number) {
  try {
    await prisma.location.delete({
      where: { id },
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete location:", error);
    return {
      error: "Failed to delete location. Please try again later.",
    };
  }
}
