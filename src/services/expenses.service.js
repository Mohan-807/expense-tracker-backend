import prisma from "../config/prisma.js";

const EXPENSE_SELECT = {
  id: true,
  title: true,
  amount: true,
  category: true,
  description: true,
  expenseDate: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

export async function addExpense({ title, amount, category, expenseDate, description }, userId) {
  return prisma.expense.create({
    data: {
      title,
      amount,
      category,
      expenseDate: new Date(expenseDate),
      description,
      userId,
    },
    select: EXPENSE_SELECT,
  });
}
