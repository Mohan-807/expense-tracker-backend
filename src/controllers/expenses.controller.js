import { addExpense as addExpenseService } from "../services/expenses.service.js";
import { getAllExpenses as getAllExpensesService } from "../services/expenses.service.js";
import { getExpense as getExpenseService } from "../services/expenses.service.js";
import { updateExpense as updateExpenseService } from "../services/expenses.service.js";
import { deleteExpense as deleteExpenseService } from "../services/expenses.service.js";
import { getKpiSummary as getKpiSummaryService } from "../services/expenses.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../constants/httpStatus.js";

export async function addExpense(req, res) {
  const data = await addExpenseService(req.body, req.user.id);
  return successResponse(res, data, "Expense added successfully", HttpStatus.CREATED);
}

export async function getAllExpenses(req, res) {
  const data = await getAllExpensesService(req.user.id);
  return successResponse(res, data, "Expenses fetched successfully", HttpStatus.OK);
}

export async function getExpense(req, res) {
 const data = await getExpenseService(req.query.expense_id, req.user.id);
 if (!data) {
   return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Expense not found" });
 }
 return successResponse(res, data, "Expense fetched successfully", HttpStatus.OK);
}

export async function deleteExpense(req, res) {
  const expenseId = req.params.id;
  const data = await deleteExpenseService(expenseId, req.user.id);
  if (!data) {
    return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Expense not found" });
  }
  return successResponse(res, data, "Expense deleted successfully", HttpStatus.OK);
}

export async function getKpiSummary(req, res) {
  const data = await getKpiSummaryService(req.user.id);
  return successResponse(res, data, "KPI summary fetched successfully", HttpStatus.OK);
}

export async function updateExpense(req, res) {
  const expenseId = req.params.id;
  const data = await updateExpenseService(expenseId, req.user.id, req.body);
  if (!data) {
    return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Expense not found" });
  }
  return successResponse(res, data, "Expense updated successfully", HttpStatus.OK);
}
