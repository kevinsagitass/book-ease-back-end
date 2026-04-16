import { getServices } from "../services/service.service.js";
import { successResponse } from "../helper/response.js";

export const getAllService = async (req, res) => {
  try {
    const result = await getServices();

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    throw err;
  }
};
