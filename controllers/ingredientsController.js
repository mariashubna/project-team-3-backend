import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllIngredients } from "../services/ingredientsServices.js";

const getIngredientsController = async (req, res) => {
  const {...filter} = req.query;
  const result = await getAllIngredients({filter});
  res.json(result);
};

export default {
  getIngredientsController: ctrlWrapper(getIngredientsController),
};
