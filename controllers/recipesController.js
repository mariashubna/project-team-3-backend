import * as recipesService from "../services/recipesServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const getRecipesByFilterController = async (req, res) => {
  const { page = 1, limit = 10, ...filter } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const { count, rows } = await recipesService.getRecipesByFilter({
    filter,
    skip,
    limit: Number(limit),
  });

  const recipes = rows.map(mapToResponse);

  res.json({
    total: count,
    totalPages: Math.ceil(count / Number(limit)),
    page: Number(page),
    limit: Number(limit),
    recipes,
  });
};

const mapToResponse = (recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      category: {
        id: recipe.category.id,
        name: recipe.category.name,
      },
      instructions: recipe.instructions,
      description: recipe.description,
      image: recipe.thumb, // Змінено з recipe.image на recipe.thumb для відповідності структурі даних
      time: recipe.time,
      owner: {
        id: recipe.user.id,
        name: recipe.user.name,
        avatar: recipe.user.avatar,
        email: recipe.user.email,
      },
      ingredients: recipe.ingredients.map((ingredient) => ({
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
          description: ingredient.desc,
          image: ingredient.img,
        },
        measure: ingredient.recipe_ingredient.measure,
      })),
      area: {
        id: recipe.area.id,
        name: recipe.area.name,
      },
    };
  } 

const getRecipeController = async (req, res) => {
  const found = await recipesService.findById({
    id: Number(req.params.id),
  });

  if (!found) {
    throw HttpError(404, "Recipe not found");
  }

  return res.json(mapToResponse(found));
};

const getPopularController = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const { count, rows } = await recipesService.getPopular({
    skip,
    limit: Number(limit),
  });

  const recipes = rows.map(mapToResponse);

  res.json({
    total: count,
    totalPages: Math.ceil(count / Number(limit)),
    page: Number(page),
    limit: Number(limit),
    recipes,
  });
};
// Додати рецепт

const addRecipeController = async (req, res) => {
  const { id: owner } = req.user;
  let thumb = null;

  if (req.file) {
    thumb = req.file.path;
  }

  // Зберігаємо в базі як thumb, але в API відповіді буде image
  const newRecipe = await recipesService.addRecipe({ ...req.body, owner, thumb });

  res.status(201).json(newRecipe);
};

// Видалити рецепт
const removeRecipeController = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  
  const deletedRecipe = await recipesService.removeRecipeById(id, userId);
  
  if (!deletedRecipe) {
    throw HttpError(404, "Recipe not found or you don't have permission to delete it");
  }
  
  res.status(200).json({ message: "Recipe deleted successfully" });
};

// Отримати список своїх рецептів
// +ПАГІНАЦІЯ
const getMyRecipeController = async (req, res) => {
  const { id: userId } = req.user;
  const { page = 1, limit = 10 } = req.query;
  
  // Перетворюємо параметри на числа і перевіряємо на NaN
  const pageNum = Number(page);
  const limitNum = Number(limit);
  
  // Якщо параметри не є числами, використовуємо значення за замовчуванням
  const validPage = isNaN(pageNum) ? 1 : pageNum;
  const validLimit = isNaN(limitNum) ? 10 : limitNum;
  
  const { count, rows } = await recipesService.getMyRecipes(userId, { page: validPage, limit: validLimit });
  
  // Використовуємо mapToResponse для форматування рецептів
  const recipes = rows.map(mapToResponse);
  
  res.status(200).json({
    count,
    recipes,
    currentPage: validPage,
    totalPages: Math.ceil(count / validLimit),
  });
};

const addFavoriteController = async (req, res) => {
  const { id: recipeId } = req.params;
  const userId = req.user.id;

  const found = await recipesService.findById({ id: Number(recipeId) });

  if (!found) {
    throw HttpError(404, "Recipe not found");
  }

  const favorite = await recipesService.addToFavorites({
    recipeId: Number(recipeId),
    userId,
  });

  res.json({
    id: favorite.recipeId,
  });

};

const removeFavoriteController = async (req, res) => {
  const { id: recipeId } = req.params;
  const userId = req.user.id;

  const found = await recipesService.findById({ id: Number(recipeId) });

  if (!found) {
    throw HttpError(404, "Recipe not found");
  }

  const isDeleted = await recipesService.removeFromFavorites({
    recipeId: Number(recipeId),
    userId,
  });

  res.json({
    id: isDeleted ? recipeId : null,
  });
};

const getMyFavoriteController = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const { count, rows } = await recipesService.getMyFavorites({
    userId,
    skip,
    limit: Number(limit),
  });

  const recipes = rows.map(mapToResponse);

  res.json({
    total: count,
    totalPages: Math.ceil(count / Number(limit)),
    page: Number(page),
    limit: Number(limit),
    recipes,
  });
};

export default {
  getRecipesByFilterController: ctrlWrapper(getRecipesByFilterController),
  getRecipeController: ctrlWrapper(getRecipeController),
  getPopularController: ctrlWrapper(getPopularController),
  addRecipeController: ctrlWrapper(addRecipeController),
  removeRecipeController: ctrlWrapper(removeRecipeController),
  getMyRecipeController: ctrlWrapper(getMyRecipeController),
  addFavoriteController: ctrlWrapper(addFavoriteController),
  removeFavoriteController: ctrlWrapper(removeFavoriteController),
  getMyFavoriteController: ctrlWrapper(getMyFavoriteController),
};
