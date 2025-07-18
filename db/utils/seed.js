import sequelize from "../Sequelize.js";
import Area from "../models/Area.js";
import Category from "../models/Category.js";
import Ingredient from "../models/Ingredient.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import RecipeIngredient from "../models/RecipeIngredient.js";
import Testimonial from "../models/Testimonial.js";
import "../models/associations.js";

import fs from "fs/promises";
import path from "path";

const loadJSON = async (filename) => {
  const filePath = path.resolve("db/data", filename);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const createIngredientIdMap = (ingredientsRaw, allIngredients) => {
  const map = {};
  for (const ing of ingredientsRaw) {
    const mongoId = ing._id?.$oid || ing._id;
    if (mongoId && !map[mongoId]) {
      const dbIngredient = allIngredients.find((i) => i.name === ing.name);
      if (dbIngredient) {
        map[mongoId] = dbIngredient;
      }
    }
  }
  return map;
};

const createUserIdMap = (usersRaw, allUsers) => {
  const map = {};
  for (const user of usersRaw) {
    const mongoId = user._id?.$oid || user.id;
    if (mongoId) {
      const dbUser = allUsers.find((u) => u.email === user.email);
      if (dbUser) {
        map[mongoId] = dbUser;
      }
    }
  }
  return map;
};

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    const areas = await loadJSON("areas.json");
    await Area.bulkCreate(areas);

    const categories = await loadJSON("categories.json");
    await Category.bulkCreate(categories);

    const ingredients = await loadJSON("ingredients.json");
    await Ingredient.bulkCreate(ingredients);

    const users = await loadJSON("users.json");
    const defaultPassword =
      "$2b$10$bFpf5Jp57HjL9iMxnityV.8v3qLQ5nlmv7ZlGBpRSEclmudNjr4j2";

    const usersWithPasswords = users.map((user) => ({
      ...user,
      password: user.password || defaultPassword,
    }));

    await User.bulkCreate(usersWithPasswords);

    const recipesRaw = await loadJSON("recipes.json");
    const usersRaw = await loadJSON("users.json");
    const ingredientsRaw = await loadJSON("ingredients.json");
    const allIngredients = await Ingredient.findAll();
    const allUsers = await User.findAll();
    const allCategories = await Category.findAll();
    const allAreas = await Area.findAll();

    const ingredientIdMap = createIngredientIdMap(
      ingredientsRaw,
      allIngredients
    );
    const userIdMap = createUserIdMap(usersRaw, allUsers);

    for (const recipe of recipesRaw) {
      const ownerOid = recipe.owner?.$oid;

      const owner = userIdMap[ownerOid];
      if (!owner) continue;

      const category = allCategories.find((c) => c.name === recipe.category);
      const area = allAreas.find((a) => a.name === recipe.area);
      if (!category || !area) continue;

      let createdAt, updatedAt;
      if (recipe.createdAt?.$date?.$numberLong) {
        createdAt = new Date(Number(recipe.createdAt.$date.$numberLong));
      }
      if (recipe.updatedAt?.$date?.$numberLong) {
        updatedAt = new Date(Number(recipe.updatedAt.$date.$numberLong));
      }

      const {
        ingredients: recipeIngs,
        owner: _,
        category: __,
        area: ___,
        createdAt: ____,
        updatedAt: _____,
        ...recipeData
      } = recipe;

      const createdRecipe = await Recipe.create({
        ...recipeData,
        owner: owner.id,
        categoryId: category.id,
        areaId: area.id,
        ...(createdAt && { createdAt }),
        ...(updatedAt && { updatedAt }),
      });

      const recipeIngredientsToInsert = [];

      for (const ing of recipeIngs) {
        let dbIngredient = null;
        if (ing.id) {
          dbIngredient = ingredientIdMap[ing.id];
        }
        if (!dbIngredient && ing.name) {
          dbIngredient = allIngredients.find((i) => i.name === ing.name);
        }
        if (!dbIngredient) continue;

        recipeIngredientsToInsert.push({
          recipeId: createdRecipe.id,
          ingredientId: dbIngredient.id,
          measure: ing.measure,
        });
      }

      if (recipeIngredientsToInsert.length) {
        await RecipeIngredient.bulkCreate(recipeIngredientsToInsert);
      }
    }

    const testimonialsRaw = await loadJSON("testimonials.json");
    const testimonialsToInsert = [];

    for (const testimonial of testimonialsRaw) {
      const ownerOid = testimonial.owner?.$oid;
      const owner = userIdMap[ownerOid];
      if (!owner) continue;

      testimonialsToInsert.push({
        testimonial: testimonial.testimonial,
        owner: owner.id,
      });
    }

    if (testimonialsToInsert.length) {
      await Testimonial.bulkCreate(testimonialsToInsert);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
