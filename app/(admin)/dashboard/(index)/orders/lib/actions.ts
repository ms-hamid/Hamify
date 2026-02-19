"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orderStatusSchema, TOrderStatus } from "@/lib/schema";

export async function updateOrderStatus(id: number, data: TOrderStatus) {
  const validation = orderStatusSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
      },
    });

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return {
      error: "Failed to update order. Please try again later.",
    };
  }
}

export async function deleteOrder(id: number) {
  try {
    await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return {
      error: "Failed to delete order. Please try again later.",
    };
  }
}
