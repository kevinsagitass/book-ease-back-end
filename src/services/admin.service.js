import prisma from "../config/prisma.js";

export const getAdminDashboard = async () => {
  try {
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    const pendingBookings = await prisma.booking.count({
      where: { status: { in: ["PENDING", "WAITING_PAYMENT"] } },
    });
    const totalUsers = await prisma.user.count({ where: { role: "USER" } });
    const recentBookings = await prisma.booking.findMany({
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

export const getAdminBookingData = async (paginationObject) => {
  try {
    const where = {};
    if (paginationObject.status) where.status = paginationObject.status;
    if (paginationObject.search) {
      where.OR = [
        { user: { name: { contains: paginationObject.search } } },
        { user: { email: { contains: paginationObject.search } } },
        { service: { name: { contains: paginationObject.search } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        service: { include: { category: true } },
        slot: true,
        payment: true,
      },
      skip: paginationObject.skip,
      take: parseInt(paginationObject.limit),
      orderBy: { createdAt: "desc" },
    });
    const count = await prisma.booking.count({ where });

    return {
      bookings,
      pagination: {
        ...paginationObject,
        total: count,
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

export const patchBookingStatus = async (bookingId, status) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status },
    });

    return booking;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const addService = async (newData) => {
  try {
    const service = await prisma.service.create({
      data: {
        name: newData.name,
        description: newData.description,
        price: parseFloat(newData.price),
        duration: parseInt(newData.duration),
        location: newData.location,
        categoryId: newData.categoryId,
      },
      include: { category: true },
    });

    if (newData.slots && newData.slots.length > 0) {
      await prisma.timeSlot.createMany({
        data: newData.slots.map((s) => ({ ...s, serviceId: service.id })),
      });
    }

    const serviceWithSlots = await prisma.service.findUnique({
      where: { id: service.id },
      include: { category: true, slots: true },
    });

    return serviceWithSlots;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const editService = async (serviceId, newData, slots) => {
  try {
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: newData,
      include: { category: true },
    });

    if (slots !== undefined) {
      await prisma.timeSlot.deleteMany({
        where: { serviceId: service.id },
      });

      if (slots.length > 0) {
        await prisma.timeSlot.createMany({
          data: slots.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            serviceId: service.id,
            maxBookings: 10,
          })),
        });
      }
    }

    const serviceWithSlots = await prisma.service.findUnique({
      where: { id: service.id },
      include: { category: true, slots: true },
    });

    return serviceWithSlots;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const removeService = async (serviceId) => {
  try {
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });

    return service;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};

export const getUsers = async (paginationObject) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      skip: paginationObject.skip,
      take: parseInt(paginationObject.limit),
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.user.count({ where: { role: "USER" } });

    return {
      users,
      pagination: {
        ...paginationObject,
        total,
        totalPage: Math.ceil(total / parseInt(paginationObject.limit)),
      },
    };
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
