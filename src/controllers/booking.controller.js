import {
  addBooking,
  getBookings,
  getBooking,
  cancelBooking,
  getBookingCountStats,
} from "../services/booking.service.js";
import { successResponse } from "../helper/response.js";

export const createBooking = async (req, res) => {
  try {
    const { serviceId, slotId, bookingDate, notes } = req.body;

    const result = await addBooking(
      {
        serviceId,
        slotId,
        bookingDate,
        notes,
      },
      req.user.id,
    );

    return successResponse(res, 201, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paginationObject = {
      status: status,
      page: page,
      limit: limit,
      skip: skip,
    };

    const result = await getBookings(userId, paginationObject);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getBooking(id, req.user.id);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const cancelBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await cancelBooking(id, req.user.id);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await getBookingCountStats(userId);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
