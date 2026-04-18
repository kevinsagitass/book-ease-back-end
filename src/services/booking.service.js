import prisma from "../config/prisma.js";

export const getExistingBookings = async (serviceId, startDate, endDate) => {
  try {
    const bookings = await prisma.booking.groupBy({
      by: ["slotId"],
      where: {
        serviceId: serviceId,
        bookingDate: { gte: startDate, lte: endDate },
        status: { notIn: ["CANCELLED"] },
      },
      _count: { slotId: true },
    });

    return bookings;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const addBooking = async (booking, userId) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: booking?.serviceId },
    });

    const newBooking = await prisma.booking.create({
      data: {
        userId: userId,
        serviceId: booking?.serviceId,
        slotId: booking?.slotId,
        bookingDate: new Date(booking?.bookingDate),
        notes: booking?.notes,
        totalAmount: service?.price,
        status: "WAITING_PAYMENT",
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        slot: true,
      },
    });

    return newBooking;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const getBooking = async (id, userId) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: id, userId: userId },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        slot: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return booking;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const cancelBooking = async (id, userId) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (["COMPLETED", "CANCELLED"].includes(booking.status)) {
      throw {
        status: 400,
        message: "Cannot cancel this booking",
      };
    }

    const updated = await prisma.booking.update({
      where: { id: id },
      data: {
        status: "CANCELLED",
      },
    });

    return updated;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
