import express from "express";
import { getAllIngredients } from "../services/ingredientsServices.js";

const ingredientsRouter = express.Router();

ingredientsRouter.get("/", async (req, res, next) => {
  try {
    const result = await getAllIngredients();
    res.json(result);
  } catch (err) {
    next(err);
  }
});


export default ingredientsRouter;





