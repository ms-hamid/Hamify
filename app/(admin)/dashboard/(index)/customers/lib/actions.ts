"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Only delete for now, creation is via auth flow or manual seed
export async function deleteCustomer(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return {
      error: "Failed to delete customer. Please try again later.",
    };
  }
}
