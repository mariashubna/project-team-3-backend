import sequelize from "../Sequelize.js";
import "../models/User.js";
import "../models/UserFollowers.js";
import "../models/Area.js";
import "../models/Category.js";
import "../models/Ingredient.js";
import "../models/Recipe.js";
import "../models/RecipeIngredient.js";
import "../models/Testimonial.js";
import "../models/FavoriteRecipe.js";
import "../models/associations.js";

sequelize
  .sync({ alter: true, force: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error syncing models:", err);
    process.exit(1);
  });
