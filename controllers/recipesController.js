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

  const recieps = rows.map(mapToResponse);

  res.json({
    total: count,
    totalPages: Math.ceil(count / Number(limit)),
    page: Number(page),
    limit: Number(limit),
    recieps,
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
      image: recipe.image,
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

// Популярні
// +ПАГІНАЦІЯ
const getPopularController = async (req, res) => {};
// Додати рецепт

const addRecipeController = async (req, res) => {
  const { id: owner } = req.user;
  let thumb = null;

  if (req.file) {
    thumb = req.file.path;
  }

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

// Отримати список своїх р-ів
// +ПАГІНАЦІЯ

const getMyRecipeController = async (req, res) => {};

// Додати в улюблені

const addFavoriteController = async (req, res) => {};

// Видалити з улюблених
const removeFavoriteController = async (req, res) => {};

// Отримати улюблені
// +ПАГІНАЦІЯ
const getMyFavoriteController = async (req, res) => {};

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
