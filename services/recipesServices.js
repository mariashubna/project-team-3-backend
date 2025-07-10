import { Op } from "sequelize";
import Recipe from "../db/models/Recipe.js";
import Category from "../db/models/Category.js";
import Area from "../db/models/Area.js";
import User from "../db/models/User.js";
import Ingredient from "../db/models/Ingredient.js";
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
  return await Recipe.findOne({
    where: { id },
    include: buildRecipiesAssosiations(),
  });
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