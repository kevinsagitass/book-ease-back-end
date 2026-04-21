import prisma from "../config/prisma.js";
import { getExistingBookings } from "./booking.service.js";

export const getServices = async (where, paginationObject) => {
  try {
    const services = await prisma.service.findMany({
      where: where,
      include: { category: true, slots: true },
      skip: parseInt(paginationObject.skip),
      take: parseInt(paginationObject.limit),
    });
    const count = await prisma.service.count({ where: where });

    return {
      services,
      pagination: {
        ...paginationObject,
        count: count,
        totalPage: Math.ceil(count / parseInt(paginationObject.limit)),
      },
    };
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const getService = async (id) => {
  try {
    const services = await prisma.service.findUnique({
      where: { id: id },
      include: { category: true },
    });

    return services;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const getSlots = async (id, date, dayOfWeek) => {
  try {
    const slots = await prisma.timeSlot.findMany({
      where: { serviceId: id, dayOfWeek: dayOfWeek },
      orderBy: { startTime: "asc" },
    });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await getExistingBookings(id, startOfDay, endOfDay);

    const bookingMap = {};
    bookings.forEach((book) => {
      bookingMap[book.slotId] = book._count.slotId;
    });

    const slotsWithAvailability = slots.map((slot) => ({
      ...slot,
      bookedCount: bookingMap[slot.id] || 0,
      available: (bookingMap[slot.id] || 0) < slot.maxBookings,
    }));

    return slotsWithAvailability;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
