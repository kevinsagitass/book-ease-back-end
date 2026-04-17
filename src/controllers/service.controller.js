import {
  getServices,
  getService,
  getSlots,
} from "../services/service.service.js";
import { successResponse } from "../helper/response.js";

export const getAllService = async (req, res) => {
  try {
    const { search, page = 1, limit = 8, categoryId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const paginationObject = {
      page: page,
      limit: limit,
      skip: skip,
    };

    const result = await getServices(where, paginationObject);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    throw err;
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getService(id);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    throw err;
  }
};

export const getServiceSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const { id } = req.params;

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    const result = await getSlots(id, date, dayOfWeek);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    throw err;
  }
};
