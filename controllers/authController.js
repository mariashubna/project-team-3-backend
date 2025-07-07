import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  changeAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../services/authServices.js";

// для зміни аватара

import { rename } from "node:fs/promises";
import { resolve, join } from "node:path";

const avatarDir = resolve("public", "avatars");

// Реєстрація

const registerController = async (req, res, next) => {
  try {
    // код з registerUser
    res.status(201).json({
      // код
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw HttpError(409, "Email in use");
    }
    throw err;
  }
};

// Логін
const loginController = async (req, res, next) => {
  const { token, user } = await loginUser(req.body);
  res.json({ token, user });
};

// Current
const getCurrentController = async (req, res, next) => {};

// отримання детальної інформації про користувача
const getDetailsController = async (req, res, next) => {};

// Зміна аватарки

const avatarsController = async (req, res, next) => {
  // код з  changeAvatar;
};

// Фоловери
// Пагінація можливо??
const getFollowersController = async (req, res, next) => {
  // код з  getFollowers;
};
//  отримання інформації щодо користувачів, за якими слідкує авторизований користувач
// Пагінація можливо??

const getFollowingController = async (req, res, next) => {
  // код з  getFollowing;
};

// додавання користувача в перелік профілів, за якими слідкує авторизований користувач

const followUserController = async (req, res, next) => {
  // код з followUser;
};

// видалення з слідкування
const unfollowUserController = async (req, res, next) => {
  // код з unfollowUser;
};

const logoutController = async (req, res, next) => {};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  getDetailsController: ctrlWrapper(getDetailsController),
  avatarsController: ctrlWrapper(avatarsController),
  getFollowersController: ctrlWrapper(getFollowersController),
  getFollowingController: ctrlWrapper(getFollowingController),
  followUserController: ctrlWrapper(followUserController),
  unfollowUserController: ctrlWrapper(unfollowUserController),
  logoutController: ctrlWrapper(logoutController),
};
