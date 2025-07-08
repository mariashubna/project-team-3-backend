import sequelize from "../Sequelize.js";
import { DataTypes } from "sequelize";

const UserFollowers = sequelize.define(
  "user_followers",
  {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

export default UserFollowers;
