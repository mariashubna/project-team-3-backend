import HttpError from "./HttpError.js";
import { getAllIngredients } from "../services/ingredientsServices.js";
import { getAllCategories } from "../services/categoriesServices.js";
import { getAllAreas } from "../services/areasServices.js";

const validateRecipeBody = (schema) => {
  return async (req, _, next) => {
    const { ingredients, category, area } = req.body;

    if (req.file) {
      req.body.thumb = req.file.path;
    } else {
      return next(HttpError(400, '"image" is required'));
    }

    const ingredientsList = await getAllIngredients();
    const categoriesList = await getAllCategories();
    const areasList = await getAllAreas();

    const availableIngredientIds = ingredientsList
      .map((ingredient) => {
        return ingredient.id ? ingredient.id.toString() : null;
      })
      .filter(Boolean);

    const availableCategories = categoriesList.map(({ name }) => {
      return name;
    });
    const availableAreas = areasList.map(({ name }) => {
      return name;
    });

    let parsedIngredients;
    try {
      parsedIngredients = Array.isArray(ingredients)
        ? ingredients
        : JSON.parse(ingredients);
    } catch (error) {
      return next(
        HttpError(400, `Invalid JSON format for ingredients: ${error.message}`)
      );
    }

    parsedIngredients.forEach(({ id }) => {
      if (!availableIngredientIds.includes(id.toString())) {
        return next(HttpError(409, `Ingredient with id ${id} not found`));
      }
    });

    req.body.ingredients = parsedIngredients;

    if (!availableCategories.includes(category)) {
      return next(
        HttpError(409, `Category ${category} not found or doesn't available`)
      );
    }

    if (!availableAreas.includes(area)) {
      return next(
        HttpError(409, `Area ${area} not found or doesn't available`)
      );
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    const categoryObj = categoriesList.find((cat) => cat.name === category);
    if (categoryObj) {
      req.body.categoryId = categoryObj.id;
    }

    const areaObj = areasList.find((a) => a.name === area);
    if (areaObj) {
      req.body.areaId = areaObj.id;
    }
    next();
  };
};

export default validateRecipeBody;
