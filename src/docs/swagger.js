import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "Expense tracker backend API",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/routes/index.js",
    "./src/routes/auth.routes.js",
    "./src/routes/expense.routes.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
