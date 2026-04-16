import { getCategories } from "../services/category.service.js";
import { successResponse } from "../helper/response.js";

export const getAllCategories = async (req, res) => {
  try {
    const result = await getCategories();

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    throw err;
  }
};
