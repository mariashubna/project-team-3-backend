import path from "path";
import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";

const ingredientsPath = path.resolve("db/data/ingredients.json");

export const getAllIngredients = async () => {
  try {
    const data = await fs.readFile(ingredientsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
  throw HttpError(500, "Failed to load ingredients");
  }
};
