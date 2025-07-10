import HttpError from "./HttpError.js";
import { getAllIngredients } from "../services/ingredientsServices.js";
import { getAllCategories } from "../services/categoriesServices.js";
import { getAllAreas } from "../services/areasServices.js";
import fs from "fs/promises";
import path from "path";

const validateRecipeBody = (schema) => {
  return async (req, _, next) => {
    const { ingredients, category, area } = req.body;

    // Додаємо шлях до файлу зображення в req.body.thumb, якщо файл завантажено
    if (req.file) {
      req.body.thumb = req.file.path;
    } else {
      // Якщо файл не завантажено, повертаємо помилку
      return next(HttpError(400, "\"thumb\" is required"));
    }

    const ingredientsList = await getAllIngredients();
    const categoriesList = await getAllCategories();
    const areasList = await getAllAreas();

    // MongoDB ObjectIDs з JSON файлу
    const availableMongoIngredients = ingredientsList.map(({ _id }) => {
      return _id.toString();
    });
    
    // Числові ID з CSV файлу
    let availableNumericIngredients = [];
    try {
      const csvPath = path.resolve("ingredients.csv");
      const csvData = await fs.readFile(csvPath, "utf-8");
      const lines = csvData.split("\n").filter(line => line.trim());
      
      // Пропускаємо заголовок
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(\d+),/);
        if (match && match[1]) {
          availableNumericIngredients.push(match[1]);
        }
      }
    } catch (err) {
      console.error("Error reading CSV file:", err);
    }
    
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
      // Перевіряємо як MongoDB ObjectID, так і числові ID
      if (!availableMongoIngredients.includes(id) && !availableNumericIngredients.includes(id)) {
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
    const categoryObj = categoriesList.find(cat => cat.name === category);
    if (categoryObj) {
      req.body.categoryId = categoryObj.id;
    }

    // Знаходимо ID регіону за назвою
    const areaObj = areasList.find(a => a.name === area);
    if (areaObj) {
      req.body.areaId = areaObj.id;
    }
    next();
  };
};

export default validateRecipeBody;
