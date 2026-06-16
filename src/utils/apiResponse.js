export const successResponse = (
  res,
  data,
  message = "Success"
) => {
  return res.status(200).json({
    success: true,
    message,
    count: Array.isArray(data)
      ? data.length
      : undefined,
    data,
  });
};