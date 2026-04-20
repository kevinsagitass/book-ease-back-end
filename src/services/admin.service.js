import prisma from "../config/prisma.js";

export const getAdminDashboard = async () => {
  try {
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    const pendingBookings = prisma.booking.count({
      where: { status: { in: ["PENDING", "WAITING_PAYMENT"] } },
    });
    const totalUsers = prisma.user.count({ where: { role: "USER" } });
    const recentBookings = prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        service: true,
      },
    });

    return {
      totalBookings,
      totalRevenue,
      pendingBookings,
      totalUsers,
      recentBookings,
    };
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
