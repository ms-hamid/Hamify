import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { TLocation } from "@/lib/schema";

export const getLocations = cache(async () => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return locations;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch locations");
  }
});

export const getLocationsList = cache(async () => {
  try {
    return await prisma.location.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch locations list");
  }
});

export async function createLocation(data: TLocation) {
  try {
    return await prisma.location.create({
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create location");
  }
}

export async function updateLocation(id: number, data: TLocation) {
  try {
    return await prisma.location.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update location");
  }
}

export async function deleteLocation(id: number) {
  try {
    return await prisma.location.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete location");
  }
}

export async function getLocationByName(name: string) {
    return await prisma.location.findFirst({
        where: { name }
    })
}

export async function getLocationByNameExcludeId(name: string, excludeId: number) {
    return await prisma.location.findFirst({
        where: { 
            name,
            NOT: { id: excludeId }
        }
    })
}
