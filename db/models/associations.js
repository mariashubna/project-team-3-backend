import Recipe from "./Recipe.js";
import Category from "./Category.js";
import Area from "./Area.js";
import User from "./User.js";
import Ingredient from "./Ingredient.js";
import RecipeIngredient from "./RecipeIngredient.js";
import FavoriteRecipe from "./FavoriteRecipe.js";

// belongsTo
Recipe.belongsTo(Category, { foreignKey: "categoryId" });
Recipe.belongsTo(Area, { foreignKey: "areaId" });
Recipe.belongsTo(User, { foreignKey: "owner" });

// many-to-many
Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: "recipeId",
  otherKey: "ingredientId",
});
Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: "ingredientId",
  otherKey: "recipeId",
});

Recipe.belongsToMany(User, {
  through: FavoriteRecipe,
  as: "usersWhoFavorited",
  foreignKey: "recipeId",
});
User.belongsToMany(Recipe, {
  through: FavoriteRecipe,
  as: "favoriteRecipes",
  foreignKey: "userId",
});
