import express from "express";
import ingredientsController from "../controllers/ingredientsController.js";

const ingredientsRouter = express.Router();

ingredientsRouter.get("/", ingredientsController.getIngredientsController);

export default ingredientsRouter;
