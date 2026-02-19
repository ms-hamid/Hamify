"use server";

import { revalidatePath } from "next/cache";
import { orderStatusSchema, TOrderStatus } from "@/lib/schema";
import { updateOrderStatus as dalUpdateOrderStatus, deleteOrder as dalDeleteOrder } from "@/lib/dal/orders";

export async function updateOrderStatus(id: number, data: TOrderStatus) {
  const result = orderStatusSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    await dalUpdateOrderStatus(id, data.status);
    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to update order status",
    };
  }
}

export async function deleteOrder(id: number) {
  try {
    await dalDeleteOrder(id);
    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete order",
    };
  }
}
