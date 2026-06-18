import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middleware/validate.middleware.js";
import protect from "../middleware/auth.middleware.js";
import { addExpense, getAllExpenses, getExpense, updateExpense, deleteExpense, getKpiSummary } from "../controllers/expenses.controller.js";
import { addExpenseSchema, updateExpenseSchema } from "../validators/auth.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management endpoints
 */

/**
 * @swagger
 * /api/expenses/add-expense:
 *   post:
 *     summary: Add a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, category, expenseDate]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Groceries
 *               amount:
 *                 type: number
 *                 example: 100.00
 *               category:
 *                 type: string
 *                 example: Food
 *               expenseDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-01
 *               description:
 *                 type: string
 *                 example: Weekly grocery shopping
 *     responses:
 *       201:
 *         description: Expense added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/add-expense", protect, validate(addExpenseSchema), asyncHandler(addExpense));

/**
 * @swagger
 * /api/expenses/get-expenses:
 *   get:
 *     summary: Get all expenses for the current authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expenses fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/get-expenses", protect, asyncHandler(getAllExpenses));

/**
 * @swagger
 * /api/expenses/get-expense:
 *   get:
 *     summary: Get a single expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: expense_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the expense to retrieve
 *         example: 1
 *     responses:
 *       200:
 *         description: Expense fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
router.get("/get-expense", protect, asyncHandler(getExpense));

/**
 * @swagger
 * /api/expenses/update-expense/{id}:
 *   patch:
 *     summary: Update an existing expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense to update
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Groceries
 *               amount:
 *                 type: number
 *                 example: 100.00
 *               category:
 *                 type: string
 *                 example: Food
 *               expenseDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-01
 *               description:
 *                 type: string
 *                 example: Weekly grocery shopping
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
router.patch(
  "/update-expense/:id",
  protect,
  validate(updateExpenseSchema),
  asyncHandler(updateExpense),
);

/**
 * @swagger
 * /api/expenses/delete-expense/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense to delete
 *         example: "1"
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
router.delete("/delete-expense/:id", protect, asyncHandler(deleteExpense));

/**
 * @swagger
 * /api/expenses/kpi-summary:
 *   get:
 *     summary: Get KPI summary cards for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPI summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalExpenses:
 *                   type: number
 *                   description: Sum of all expenses ever recorded
 *                   example: 5200.00
 *                 thisMonthExpenses:
 *                   type: number
 *                   description: Sum of expenses in the current calendar month
 *                   example: 850.00
 *                 todayExpenses:
 *                   type: number
 *                   description: Sum of expenses recorded today
 *                   example: 120.00
 *                 totalRecords:
 *                   type: integer
 *                   description: Total number of expense records
 *                   example: 42
 *       401:
 *         description: Unauthorized
 */
router.get("/kpi-summary", protect, asyncHandler(getKpiSummary));

export default router;
