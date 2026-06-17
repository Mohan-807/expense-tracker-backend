import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
import { HttpStatus } from "../constants/httpStatus.js";

// Prisma known error codes → friendly messages
function handlePrismaError(err) {
  switch (err.code) {
    case "P2002":
      return new AppError(
        `Duplicate value for field: ${err.meta?.target?.join(", ")}`,
        HttpStatus.CONFLICT
      );
    case "P2025":
      return new AppError("Record not found", HttpStatus.NOT_FOUND);
    case "P2003":
      return new AppError("Related record not found", HttpStatus.BAD_REQUEST);
    default:
      return new AppError("Database error", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const errorMiddleware = (err, req, res, _next) => {
  let error = err;

  // Normalize Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    error = handlePrismaError(err);
  }

  // Normalize JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    error = new AppError("Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }

  const statusCode = error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message ?? "Internal Server Error";

  logger.error(`${req.method} ${req.originalUrl} [${statusCode}] - ${message}`, {
    stack: statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" &&
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR && { stack: err.stack }),
  });
};

export default errorMiddleware;
