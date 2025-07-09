import Recipe from "./Recipe.js";
import Category from "./Category.js";
import Area from "./Area.js";
import User from "./User.js";
import Ingredient from "./Ingredient.js";
import RecipeIngredient from "./RecipeIngredient.js";
import FavoriteRecipe from "./FavoriteRecipe.js";
import UserFollowers from "./UserFollowers.js";
import Testimonial from "./Testimonial.js";

// belongsTo
Recipe.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Recipe.belongsTo(Area, { foreignKey: "areaId", as: "area" });
Recipe.belongsTo(User, { foreignKey: "owner", as: "user" });

// many-to-many
Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: "recipeId",
  otherKey: "ingredientId",
  as: "ingredients",
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

User.belongsToMany(User, {
  as: "followers",
  through: UserFollowers,
  foreignKey: "followingId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  as: "following",
  through: UserFollowers,
  foreignKey: "followerId",
  otherKey: "followingId",
});

Testimonial.belongsTo(User, { foreignKey: "owner", as: "user" });
User.hasMany(Testimonial, { foreignKey: "owner", as: "testimonials" });
