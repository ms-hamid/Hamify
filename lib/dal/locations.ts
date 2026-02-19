import { prisma } from "@/lib/prisma";
import { cache } from "react";

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
