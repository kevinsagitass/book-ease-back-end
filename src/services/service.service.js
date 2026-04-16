import prisma from "../config/prisma.js";

export const getServices = async (where, paginationObject) => {
  try {
    const services = await prisma.service.findMany({
      where: where,
      include: { category: true },
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
