import HttpError from "./HttpError.js";
import { getAllIngredients } from "../services/ingredientsServices.js";
import { getAllCategories } from "../services/categoriesServices.js";
import { getAllAreas } from "../services/areasServices.js";

const validateRecipeBody = (schema) => {
  return async (req, _, next) => {
    const { ingredients, category, area } = req.body;

    const ingredientsList = await getAllIngredients();
    const categoriesList = await getAllCategories();
    const areasList = await getAllAreas();

    const availableIngredients = ingredientsList.map(({ _id }) => {
      return _id.toString();
    });
    const availableCategories = categoriesList.map(({ name }) => {
      return name;
    });
    const availableAreas = areasList.map(({ name }) => {
      return name;
    });

    //  Перевірка інгрідієнтів
    const parsedIngredients = Array.isArray(ingredients)
      ? ingredients
      : JSON.parse(ingredients);

    parsedIngredients.forEach(({ id }) => {
      if (!availableIngredients.includes(id)) {
        return next(HttpError(409, `Ingredient with id ${id} not found`));
      }
    });

    req.body.ingredients = parsedIngredients;

    //  Перевірка категорій
    if (!availableCategories.includes(category)) {
      return next(
        HttpError(409, `Category ${category} not found or doesn't available`)
      );
    }

    //   Перевірка регіону
    if (!availableAreas.includes(area)) {
      return next(
        HttpError(409, `Area ${area} not found or doesn't available`)
      );
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
};

export default validateRecipeBody;
