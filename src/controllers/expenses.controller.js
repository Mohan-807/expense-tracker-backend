import { addExpense as addExpenseService } from "../services/expenses.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../constants/httpStatus.js";

export async function addExpense(req, res) {
  const data = await addExpenseService(req.body, req.user.id);
  return successResponse(res, data, "Expense added successfully", HttpStatus.CREATED);
}
