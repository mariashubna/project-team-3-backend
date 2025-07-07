import User from "../db/users.js";
import HttpError from "../helpers/HttpError.js";

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {};

export const loginUser = async ({ email, password }) => {};

export const changeAvatar = async (userId, avatar) => {};

export const getFollowers = async (userId) => {};

export const getFollowing = async (userId) => {};

export const followUser = async (userId) => {};

export const unfollowUser = async (userId) => {};

export const logoutUser = async ({ email }) => {};
