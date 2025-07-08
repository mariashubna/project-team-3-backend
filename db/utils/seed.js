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
    const mongoId = ing._id?.$oid || ing.id;
    if (mongoId) {
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

    // 1. Areas
    const areas = await loadJSON("areas.json");
    await Area.bulkCreate(areas);

    // 2. Categories
    const categories = await loadJSON("categories.json");
    await Category.bulkCreate(categories);

    // 3. Ingredients
    const ingredients = await loadJSON("ingredients.json");
    await Ingredient.bulkCreate(ingredients);

    // 4. Users
    const users = await loadJSON("users.json");
    await User.bulkCreate(users);

    // 5. Recipes + ingredients
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
      // Extract owner OID from recipe
      const ownerOid = recipe.owner?.$oid;
      // Find owner in userIdMap
      const owner = userIdMap[ownerOid];
      if (!owner) continue;

      // Find category and area by name
      const category = allCategories.find((c) => c.name === recipe.category);
      const area = allAreas.find((a) => a.name === recipe.area);
      if (!category || !area) continue;

      // Convert createdAt and updatedAt from MongoDB format to Date
      let createdAt, updatedAt;
      if (recipe.createdAt?.$date?.$numberLong) {
        createdAt = new Date(Number(recipe.createdAt.$date.$numberLong));
      }
      if (recipe.updatedAt?.$date?.$numberLong) {
        updatedAt = new Date(Number(recipe.updatedAt.$date.$numberLong));
      }

      // Create recipe (without ingredients, owner, category, area, createdAt, updatedAt)
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

      // Adding ingredients to the recipe
      for (const ing of recipeIngs) {
        let dbIngredient = null;
        if (ing.id) {
          dbIngredient = ingredientIdMap[ing.id];
        }
        if (!dbIngredient && ing.name) {
          dbIngredient = allIngredients.find((i) => i.name === ing.name);
        }
        if (!dbIngredient) continue;
        await createdRecipe.addIngredient(dbIngredient, {
          through: { measure: ing.measure },
        });
      }
    }

    // 6. Testimonials
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
