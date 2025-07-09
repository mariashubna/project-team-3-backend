import { Op } from "sequelize";
import Recipe from "../db/models/Recipe.js";
import Category from "../db/models/Category.js";
import Area from "../db/models/Area.js";
import User from "../db/models/User.js";
import Ingredient from "../db/models/Ingredient.js";
import "../db/models/associations.js";

const emptyResponse = { count: 0, rows: [] };

export const getRecipesByFilter = async ({ filter, skip, limit }) => {
  const { category, ingredient, area, ownerId } = filter;

  const include = [
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
