import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const Area = sequelize.define(
  "area",
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

export default Area;
