import HttpError from "./HttpError.js";
import { getAllIngredients } from "../services/ingredientsServices.js";
import { getAllCategories } from "../services/categoriesServices.js";
import { getAllAreas } from "../services/areasServices.js";

const validateRecipeBody = (schema) => {
  return async (req, _, next) => {
    const { ingredients, category, area } = req.body;

    // Додаємо шлях до файлу зображення в req.body.thumb, якщо файл завантажено
    if (req.file) {
      // Отримуємо файл як image, але зберігаємо в базі як thumb
      req.body.thumb = req.file.path;
    } else {
      // Якщо файл не завантажено, повертаємо помилку
      return next(HttpError(400, '"image" is required'));
    }

    const ingredientsList = await getAllIngredients();
    const categoriesList = await getAllCategories();
    const areasList = await getAllAreas();

    // ID інгредієнтів з бази даних
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

    //  Перевірка інгрідієнтів
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
      // Перевіряємо наявність інгредієнта в базі даних
      if (!availableIngredientIds.includes(id.toString())) {
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

    // Перевірка наявності файлу вже виконана вище

    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    // Після валідації Joi додаємо ID категорії та регіону
    // Знаходимо ID категорії за назвою
    const categoryObj = categoriesList.find((cat) => cat.name === category);
    if (categoryObj) {
      req.body.categoryId = categoryObj.id;
    }

    // Знаходимо ID регіону за назвою
    const areaObj = areasList.find((a) => a.name === area);
    if (areaObj) {
      req.body.areaId = areaObj.id;
    }
    next();
  };
};

export default validateRecipeBody;
