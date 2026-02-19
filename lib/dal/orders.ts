import { prisma } from "@/lib/prisma";
import { TOrderStatus } from "@/lib/schema";

export async function updateOrderStatus(id: number, status: string) {
  try {
    return await prisma.order.update({
      where: { id },
      data: {
        status: status as any,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update order status");
  }
}

export async function deleteOrder(id: number) {
  try {
    return await prisma.order.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete order");
  }
}
