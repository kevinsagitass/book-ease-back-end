import { addBooking, getBooking } from "../services/booking.service.js";
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
    throw {
      status: 500,
      message: err,
    };
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getBooking(id, req.user.id);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw {
      status: 500,
      message: err,
    };
  }
};
