import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
  "category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Category;
