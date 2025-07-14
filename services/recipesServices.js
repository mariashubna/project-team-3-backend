import { Op } from "sequelize";
import Recipe from "../db/models/Recipe.js";
import Category from "../db/models/Category.js";
import Area from "../db/models/Area.js";
import User from "../db/models/User.js";
import Ingredient from "../db/models/Ingredient.js";
import RecipeIngredient from "../db/models/RecipeIngredient.js";
import "../db/models/associations.js";
import FavoriteRecipe from "../db/models/FavoriteRecipe.js";
import sequelize from "../db/Sequelize.js";

const emptyResponse = { count: 0, rows: [] };

function buildRecipiesAssosiations() {
  return [
    {
      model: Category,
      as: "category",
      attributes: ["id", "name"],
    },
    {
      model: Area,
      as: "area",
      attributes: ["id", "name"],
    },
    {
      model: User,
      as: "user",
      attributes: ["id", "name", "avatar", "email"],
    },
    {
      model: Ingredient,
      as: "ingredients",
      attributes: ["id", "name", "desc", "img"],
      through: {
        attributes: ["measure"],
      },
    },
  ];
}

export const getRecipesByFilter = async ({ filter, skip, limit }) => {
  const { category, ingredient, area, ownerId } = filter;

  const include = buildRecipiesAssosiations();

  const where = {};

  if (category) {
    const found = await Category.findOne({
      where: {
        name: {
          [Op.iLike]: `%${category}%`,
        },
      },
    });

    if (found) {
      where.categoryId = found.id;
    } else {
      return emptyResponse;
    }
  }

  if (area) {
    const found = await Area.findOne({
      where: {
        name: {
          [Op.iLike]: `%${area}%`,
        },
      },
    });

    if (found) {
      where.areaId = found.id;
    } else {
      return emptyResponse;
    }
  }

  if (ingredient) {
    const found = await Ingredient.findOne({
      where: {
        name: { [Op.iLike]: `%${ingredient}%` },
      },
    });

    if (found) {
      include.push({
        model: Ingredient,
        as: "ingredients",
        where: { id: found.id },
        attributes: ["id", "name", "desc", "img"],
        through: {
          attributes: ["measure"],
        },
      });
    } else {
      return emptyResponse;
    }
  }

  if (ownerId) {
    where.owner = ownerId;
  }

  const { count, rows } = await Recipe.findAndCountAll({
    where,
    include,
    offset: skip,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return { count, rows };
};

export const findById = async ({ id }) => {
  const recipe = await Recipe.findByPk(id, {
    include: buildRecipiesAssosiations(),
  });

  return recipe;
};

export const updateById = async (id, updateData) => {
  const [updatedRowsCount, updatedRows] = await Recipe.update(updateData, {
    where: { id },
    returning: true,
  });

  return updatedRowsCount > 0 ? updatedRows[0] : null;
};

export const getPopular = async ({ skip, limit }) => {
  let rows = await FavoriteRecipe.findAll({
    attributes: [
      "recipeId",
      [sequelize.fn("COUNT", sequelize.col("userId")), "count"],
    ],
    group: ["recipeId"],
    order: [[sequelize.literal("count"), "DESC"]],
    offset: skip,
    limit,
  });

  const count = await FavoriteRecipe.count({
    col: "recipeId",
    distinct: true,
  });

  if (!count | !rows) {
    return emptyResponse;
  }

  const ids = rows.map((r) => r.recipeId);

  rows = await getRecipesByIds(ids);

  return {
    count,
    rows,
  };
};

const getRecipesByIds = async (ids) => { 
  return await Recipe.findAll({
    where: { id: ids },
    include: buildRecipiesAssosiations(),
    order: [
      sequelize.literal(
        `array_position(ARRAY[${ids.join(",")}]::int[], "recipe"."id")`
      ),
    ],
  });
};

export const addToFavorites = async ({ recipeId, userId }) => {
  const [favorite, created] = await FavoriteRecipe.findOrCreate({
    where: { recipeId, userId },
    defaults: { recipeId, userId },
  });

  if (!created) {
    return favorite;
  }

  return favorite;
}

export const addRecipe = async (data) => {
  const { ingredients, ...recipeData } = data;

  const newRecipe = await Recipe.create(recipeData);

  if (ingredients && ingredients.length > 0) {
    const recipeIngredients = ingredients.map((ingredient) => ({
      recipeId: newRecipe.id,
      ingredientId: ingredient.id,
      measure: ingredient.measure,
    }));
    await RecipeIngredient.bulkCreate(recipeIngredients);
  }

  return newRecipe;
};

// Видалити рецепт
const removeRecipe = async (recipeId, userId) => {
  // Перевіряємо, чи існує рецепт і чи належить він користувачу
  const recipe = await Recipe.findOne({ 
    where: { 
      id: recipeId,
      owner: userId 
    } 
  });
  
  if (!recipe) {
    return null;
  }
  
  // Видаляємо зв'язки з інгредієнтами
  await RecipeIngredient.destroy({ where: { recipeId } });
  
  // Видаляємо сам рецепт
  await recipe.destroy();
  
  return recipe;
};

export const removeRecipeById = removeRecipe;

// Отримати власні рецепти користувача
export const getMyRecipes = async (userId, { page = 1, limit = 10 } = {}) => {
  // Перетворюємо параметри на числа і перевіряємо на NaN
  const pageNum = Number(page);
  const limitNum = Number(limit);
  
  // Якщо параметри не є числами, використовуємо значення за замовчуванням
  const validPage = isNaN(pageNum) ? 1 : pageNum;
  const validLimit = isNaN(limitNum) ? 10 : limitNum;
  
  const skip = (validPage - 1) * validLimit;
  
  const { count, rows } = await Recipe.findAndCountAll({
    where: { owner: userId },
    include: buildRecipiesAssosiations(),
    offset: skip,
    limit: validLimit,
    order: [["createdAt", "DESC"]],
    distinct: true, // Додаємо опцію distinct: true для правильного підрахунку унікальних рецептів
  });
  
  return { count, rows };
};

export const removeFromFavorites = async ({ recipeId, userId }) => {
  const deleted = await FavoriteRecipe.destroy({
    where: { recipeId, userId },
  });

  return deleted > 0;
};

export const getMyFavorites = async ({ userId, skip, limit }) => {
  let {count, rows} = await FavoriteRecipe.findAndCountAll({
    where: { userId },
    attributes: ["recipeId"],
    limit,
    offset: skip,
  });
  
  const ids = rows.map((r) => r.recipeId);

  rows = await getRecipesByIds(ids);

  return { count, rows };
};
