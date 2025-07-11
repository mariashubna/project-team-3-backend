import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllIngredients } from "../services/ingredientsServices.js";

const getIngredientsController = async (req, res) => {
  const result = await getAllIngredients();
  res.json(result);
};

export default {
  getIngredientsController: ctrlWrapper(getIngredientsController),
};
