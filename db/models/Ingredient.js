import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const Ingredient = sequelize.define(
  "ingredient",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Ingredient;
