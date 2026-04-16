import prisma from "../config/prisma.js";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany();

    return categories;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
