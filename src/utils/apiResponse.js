import { HttpStatus } from "../constants/httpStatus.js";

export const successResponse = (res, data, message = "Success", statusCode = HttpStatus.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(Array.isArray(data) && { count: data.length }),
    data,
  });
};
