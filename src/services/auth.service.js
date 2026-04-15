import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../helper/jwt.helper.js";

export const registerUser = async (user) => {
  const userExisting = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (userExisting) {
    throw {
      status: 400,
      message: "User Already Exists",
    };
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: hashedPassword,
      name: user.name,
      phone: user.phone,
      role: "USER",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      phone: true,
    },
  });

  const token = generateToken(user.id);

  return {
    newUser,
    token,
  };
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw {
      status: 401,
      message: "Invalid Credentials",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw {
      status: 401,
      message: "Invalid Credentials",
    };
  }

  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token: token,
  };
};
