import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getUserById } from "../services/auth.service.js";
import AppError from "../utils/AppError.js";
import { HttpStatus } from "../constants/httpStatus.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("No token provided", HttpStatus.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }

  req.user = await getUserById(decoded.id);
  next();
});

export default protect;
