import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";
import { pool } from "./config/db.js";

app.listen(env.PORT, () => {
 logger.info(
  `Server running on port ${env.PORT}`
);
});

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();