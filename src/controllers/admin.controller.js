import { successResponse } from "../helper/response.js";
import { getAdminDashboard } from "../services/admin.service.js";

export const getDashboardStats = async (req, res) => {
  try {
    const adminDashboardStats = await getAdminDashboard();

    const result = {
      stats: {
        totalBookings: adminDashboardStats.totalBookings,
        totalRevenue: adminDashboardStats.totalRevenue._sum.amount || 0,
        pendingBookings: adminDashboardStats.pendingBookings,
        totalUsers: adminDashboardStats.totalUsers,
      },
      recentBookings: adminDashboardStats.recentBookings,
    };

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
