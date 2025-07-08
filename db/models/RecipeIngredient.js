import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const RecipeIngredient = sequelize.define(
  "recipe_ingredient",
  {
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "recipes",
        key: "id",
      },
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ingredients",
        key: "id",
      },
    },
    measure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default RecipeIngredient;
