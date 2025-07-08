import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const Testimonial = sequelize.define("testimonial", {
  testimonial: {
    type: DataTypes.TEXT,
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
});

export default Testimonial;
