import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import { HttpStatus } from "../constants/httpStatus.js";

const SALT_ROUNDS = 10;

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

function signToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already in use", HttpStatus.CONFLICT);

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: USER_SELECT,
  });

  const token = signToken(user.id);
  return { token, user };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED);

  const token = signToken(user.id);
  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });
  if (!user) throw new AppError("User not found", HttpStatus.NOT_FOUND);
  return user;
}
