import prisma from "../config/prisma.js";

export const getServices = async () => {
  try {
    const services = await prisma.service.findMany();

    return services;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
