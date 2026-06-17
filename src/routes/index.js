import { Router } from "express";
import authRoutes from "./auth.routes.js";
import expenseRoutes from "./expense.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health Check
 *     description: Verify server is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 */

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

export default router;