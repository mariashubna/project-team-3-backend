import * as recipesService from "../services/recipesServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

// Рецепти всі + фільтр
// +ПАГІНАЦІЯ
const getRecipesByFilterController = async (req, res) => {};

// Один рецепт
const getRecipeController = async (req, res) => {};

// Популярні
// +ПАГІНАЦІЯ
const getPopularController = async (req, res) => {};
// Додати рецепт

const addRecipeController = async (req, res) => {};

// Видалити рецепт
const removeRecipeController = async (req, res) => {};

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
