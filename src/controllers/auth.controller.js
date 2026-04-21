import { registerUser, loginUser } from "../services/auth.service.js";
import { successResponse } from "../helper/response.js";
import { generateToken } from "../helper/jwt.helper.js";

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
    throw err;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return successResponse(res, 200, "Success", result);
  } catch (err) {
    throw err;
  }
};

export const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user.id);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.log(err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};

export const getMe = async (req, res) => {
  try {
    return successResponse(res, 200, "Success", {
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
