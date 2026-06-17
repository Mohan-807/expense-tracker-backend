import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middleware/validate.middleware.js";
import protect from "../middleware/auth.middleware.js";
import { addExpense } from "../controllers/expenses.controller.js";
import { addExpenseSchema } from "../validators/auth.validator.js";

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

export default router;
