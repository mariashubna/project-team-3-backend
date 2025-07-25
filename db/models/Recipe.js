import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const Recipe = sequelize.define(
  "recipe",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    areaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "areas",
        key: "id",
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Recipe;
