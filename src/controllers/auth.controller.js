import { registerUser, loginUser } from "../services/auth.service.js";
import { successResponse } from "../helper/response.js";

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const { newUser, token } = await registerUser({
      email,
      password,
      name,
      phone,
    });

    return successResponse(res, 201, "Success", {
      user: newUser,
      token: token,
    });
  } catch (err) {
    console.log(err);
    throw {
      status: 500,
      message: err,
    };
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    console.log(err);
    throw {
      status: 500,
      message: err,
    };
  }
};
