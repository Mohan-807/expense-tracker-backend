import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";
import errorMiddleware from "./middleware/error.middleware.js";
import routes from "./routes/index.js";
import requestLogger from "./middleware/requestLogger.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use("/api", routes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorMiddleware);

export default app;