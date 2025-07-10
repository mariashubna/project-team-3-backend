import Ingredient from "../db/models/Ingredient.js";
import HttpError from "../helpers/HttpError.js";

export const getAllIngredients = async () => {
  try {
    return await Ingredient.findAll();
  } catch (err) {
    throw HttpError(500, "Failed to load ingredients");
  }
};
