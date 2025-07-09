import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./db/Sequelize.js";

import {
  recipesRouter,
  usersRouter,
  categoriesRouter,
  areasRouter,
  ingredientsRouter,
  testimonialsRouter,
} from "./routes/index.js";

import { specs } from "./swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/areas", areasRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/recipes", recipesRouter);

app.use(express.static("public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

