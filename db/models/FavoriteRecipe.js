import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const FavoriteRecipe = sequelize.define(
  "favorite_recipe",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "recipes",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    uniqueKeys: {
      unique_favorite: {
        fields: ["userId", "recipeId"],
      },
    },
  }
);

export default FavoriteRecipe;
