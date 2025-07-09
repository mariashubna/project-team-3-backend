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
  getUserDetails
} from "../services/authServices.js";

import { saveAvatarToPublic } from "../helpers/saveAvatarFiles.js";

// для зміни аватара

// import { rename } from "node:fs/promises";
// import { resolve, join } from "node:path";

// const avatarDir = resolve("public", "avatars");

// Реєстрація

const registerController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({
      user: {
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};


// Логін
const loginController = async (req, res, next) => {
  const { token, user } = await loginUser(req.body);
  res.json({ token, user });
};

// Current
const getCurrentController = async (req, res, next) => {
  const { email, avatar, name } = req.user;
  res.json({
    email,
    avatar,
    name,
  });
};
// отримання детальної інформації про користувача
const getDetailsController = async (req, res, next) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.userId;

  const userDetails = await getUserDetails(currentUserId, targetUserId);
  res.json(userDetails);
};

// Зміна аватарки

const avatarsController = async (req, res, next) => {
  const { id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar file is required");
  }
  const tempUploadPath = req.file.path;
  const originalName = req.file.originalname;

  const avatarURL = await saveAvatarToPublic(id, tempUploadPath, originalName);
  const updatedUser = await changeAvatar(id, avatarURL); 
  res.json({
    avatar: avatarURL
  });
};

//  Фоловери
const getFollowersController = async (req, res, next) => {
  // код з  getFollowers;
  const userId = req.user.id; // або req.params.userId, залежно від маршруту

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const data = await getFollowers(userId, page, limit);

  res.json(data);
};
//  отримання інформації щодо користувачів, за якими слідкує авторизований користувач
// Пагінація можливо??

const getFollowingController = async (req, res, next) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const data = await getFollowing(userId, page, limit);

  res.json(data);
};

// додавання користувача в перелік профілів, за якими слідкує авторизований користувач

const followUserController = async (req, res, next) => {
  // код з followUser;
  const userId = req.user.id;
  const targetUserId = req.params.userId;

  const result = await followUser(userId, targetUserId);
  res.status(200).json(result);
};

// видалення з слідкування
const unfollowUserController = async (req, res, next) => {
  // код з unfollowUser;
  const userId = req.user.id;
  const targetUserId = req.params.userId;

  const result = await unfollowUser(userId, targetUserId);
  res.status(200).json(result);
};

const logoutController = async (req, res) => {
  const { email } = req.user;
  await logoutUser({email});
  res.status(204).send();
};

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
