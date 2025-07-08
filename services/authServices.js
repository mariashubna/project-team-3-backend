import User from "../db/users.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const existingUser = await findUser({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload = {}) => {
  const { email, password } = payload;
  const existingUser = await findUser({ where: { email } });

  if (!existingUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, existingUser.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const tokenPayload = {
    id: existingUser.id,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });
  existingUser.token = token;
  await existingUser.save();

  return {
    token,
    user: existingUser,
  };
};


export const getUserDetails = async (currentUserId, targetUserId) => {
  const user = await findUser({ id: targetUserId });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const userData = {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
  };

  const recipeCount = (await user.countRecipes?.()) || 0;
  const followerCount = (await user.countFollowers?.()) || 0;

  if (currentUserId === user.id) {
    const favoriteCount = (await user.countFavorites?.()) || 0;
    const followingCount = (await user.countFollowing?.()) || 0;

    return {
      ...userData,
      recipes: recipeCount,
      favorites: favoriteCount,
      followers: followerCount,
      following: followingCount,
    };
  }

  return {
    ...userData,
    recipes: recipeCount,
    followers: followerCount,
  };
};

export const changeAvatar = async (userId, avatar) => {
  const user = await findUser({ id: userId });
  if (!user) {
    throw HttpError(404, "Not found");
  }
  await user.update({ avatar });
  return user;
  
}; //змінити під модель 

export const getFollowers = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const user = await findUser({ id: userId });
  if (!user) {
    throw HttpError(404, "Not found");
  }

  const rawFollowers = await user.getFollowers({
    offset,
    limit,
    attributes: ["id", "name", "avatar"],
  });

  //  кількість рецептів і 3 фото
  const followers = await Promise.all(
    rawFollowers.map(async (follower) => {
      const recipes = await follower.getRecipes({
        limit: 3,
        order: [["createdAt", "DESC"]],
        attributes: ["image"], // або photo залежить як поле назвемо
      });

      return {
        id: follower.id,
        name: follower.name,
        avatar: follower.avatar,
        recipesCount: await follower.countRecipes(),
        recipesPreview: recipes.map((r) => r.image), // або r.photo
      };
    })
  );

  const totalFollowers = await user.countFollowers();

  return {
    total: totalFollowers,
    page,
    limit,
    followers,
  };
};

export const getFollowing = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const user = await findUser({ id: userId });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const rawFollowing = await user.getFollowing({
    offset,
    limit,
    attributes: ["id", "name", "avatar"],
  });

  const following = await Promise.all(
    rawFollowing.map(async (followedUser) => {
      const recipes = await followedUser.getRecipes({
        limit: 3,
        order: [["createdAt", "DESC"]],
        attributes: ["image"],
      });

      return {
        id: followedUser.id,
        name: followedUser.name,
        avatar: followedUser.avatar,
        recipesCount: await followedUser.countRecipes(),
        recipesPreview: recipes.map((r) => r.image),
      };
    })
  );
  const totalFollowing = await user.countFollowing();

  return {
    total: totalFollowing,
    page,
    limit,
    following,
  };
};

export const followUser = async (userId, targetUserId) => {
  if (userId === targetUserId) {
    throw HttpError(400, "Cannot follow yourself");
  }

  const user = await findUser({ id: userId });
  const target = await findUser({ id: targetUserId });

  if (!user || !target) {
    throw HttpError(404, "User not found");
  }

  const alreadyFollowing = await user.hasFollowing(target);
  if (alreadyFollowing) {
    throw HttpError(409, "Already following this user");
  }

  await user.addFollowing(target);
  return { message: "Successfully followed" };
};

export const unfollowUser = async (userId, targetUserId) => {
  const user = await findUser({ id: userId });
  const target = await findUser({ id: targetUserId });

  if (!user || !target) {
    throw HttpError(404, "User not found");
  }

  const isFollowing = await user.hasFollowing(target);
  if (!isFollowing) {
    throw HttpError(409, "You are not following this user");
  }

  await user.removeFollowing(target);
  return { message: "Successfully unfollowed" };
};

export const logoutUser = async ({ email }) => {
  const user = await findUser({ where: { email } });
  if (!user || !user.token) {
    throw HttpError(401, "Not found");
  }

  await user.update({ token: null });
};
