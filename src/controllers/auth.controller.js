import { registerUser, loginUser } from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../constants/httpStatus.js";

export async function register(req, res) {
  const data = await registerUser(req.body);
  return successResponse(res, data, "Registered successfully", HttpStatus.CREATED);
}

export async function login(req, res) {
  const data = await loginUser(req.body);
  return successResponse(res, data, "Logged in successfully");
}

export async function getMe(req, res) {
  return successResponse(res, req.user, "User fetched successfully");
}
