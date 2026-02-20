import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function getDashboardStats() {
  const [orderCount, productCount, customerCount, paidOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.findMany({
      where: { status: "delivered" }, // Using 'delivered' as completed/paid
      select: { total: true },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((acc, order) => acc + Number(order.total), 0);

  return {
    totalRevenue,
    totalOrders: orderCount,
    totalProducts: productCount,
    totalCustomers: customerCount,
  };
}

export async function getRecentSales() {
  // Get sales for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
      status: "delivered",
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by day
  const salesByDay: Record<string, number> = {};
  
  // Initialize last 7 days with 0
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = format(d, "yyyy-MM-dd");
    salesByDay[dateStr] = 0;
  }

  orders.forEach((order) => {
    const dateStr = format(order.createdAt, "yyyy-MM-dd");
    if (salesByDay[dateStr] !== undefined) {
      salesByDay[dateStr] += Number(order.total);
    }
  });

  return Object.entries(salesByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({
      name: format(new Date(date), "dd MMM"),
      total,
    }));
}

export async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}
