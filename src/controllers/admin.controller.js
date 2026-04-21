import { successResponse } from "../helper/response.js";
import {
  addService,
  editService,
  getAdminBookingData,
  getAdminDashboard,
  getUsers,
  patchBookingStatus,
  removeService,
} from "../services/admin.service.js";
import prisma from "../config/prisma.js";

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
    console.log(err);
    throw err;
  }
};

export const getAdminBookings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paginationObject = {
      status: status,
      search: search,
      page: page,
      limit: limit,
      skip: skip,
    };

    const result = await getAdminBookingData(paginationObject);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw {
        status: 400,
        message: "Invalid Status!",
      };
    }

    const result = await patchBookingStatus(id, status);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, duration, location, categoryId, slots } =
      req.body;

    const service = {
      name,
      description,
      price,
      duration,
      location,
      categoryId,
      slots,
    };

    const result = await addService(service);

    return successResponse(res, 201, "Success", result);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      location,
      categoryId,
      isActive,
      slots,
    } = req.body;

    const { id } = req.params;

    const service = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(duration && { duration: parseInt(duration) }),
      ...(location !== undefined && { location }),
      ...(categoryId && { categoryId }),
      ...(isActive !== undefined && { isActive }),
    };

    const result = await editService(id, service, slots);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await removeService(id);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paginationObject = {
      page: page,
      limit: limit,
      skip: skip,
    };

    const result = await getUsers(paginationObject);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
