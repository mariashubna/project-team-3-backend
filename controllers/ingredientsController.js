import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllIngredients } from "../services/ingredientsServices.js";

const getIngredientsController = async (req, res, next) => {
  try {
    const result = await getAllIngredients();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getIngredientsController: ctrlWrapper(getIngredientsController),
};


