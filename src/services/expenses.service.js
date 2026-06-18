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

export async function getAllExpenses(userId) {
  return prisma.expense.findMany({
    where: { userId },
    select: EXPENSE_SELECT,
  });
}

export async function getExpense(expenseId, userId) {
  const expenseIdParsed = typeof expenseId === "string" ? parseInt(expenseId, 10) : expenseId;
  return prisma.expense.findFirst({
    where: { id: expenseIdParsed, userId },
    select: EXPENSE_SELECT,
  });
}

export async function deleteExpense(expenseId, userId) {
  const expenseIdParsed = typeof expenseId === "string" ? parseInt(expenseId, 10) : expenseId;

  const existingExpense = await prisma.expense.findFirst({
    where: { id: expenseIdParsed, userId },
  });

  if (!existingExpense) {
    return null;
  }

  return prisma.expense.delete({
    where: { id: expenseIdParsed },
    select: EXPENSE_SELECT,
  });
}

export async function getKpiSummary(userId) {
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totalAggregate, thisMonthAggregate, todayAggregate, totalRecords] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId, expenseDate: { gte: startOfMonth, lt: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId, expenseDate: { gte: startOfToday, lt: endOfToday } },
      _sum: { amount: true },
    }),
    prisma.expense.count({ where: { userId } }),
  ]);

  return {
    totalExpenses: totalAggregate._sum.amount ?? 0,
    thisMonthExpenses: thisMonthAggregate._sum.amount ?? 0,
    todayExpenses: todayAggregate._sum.amount ?? 0,
    totalRecords,
  };
} 

export async function updateExpense(expenseId, userId, updateData) {
  const expenseIdParsed = typeof expenseId === "string" ? parseInt(expenseId, 10) : expenseId;
  
  const existingExpense = await prisma.expense.findFirst({
    where: { id: expenseIdParsed, userId },
  });

  if (!existingExpense) {
    return null;
  }

  const dataToUpdate = { ...updateData };
  if (updateData.expenseDate) {
    dataToUpdate.expenseDate = new Date(updateData.expenseDate);
  }

  return prisma.expense.update({
    where: { id: expenseIdParsed },
    data: dataToUpdate,
    select: EXPENSE_SELECT,
  });
}
