import User from "../db/models/User.js"
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import Recipe from "../db/models/Recipe.js";
import UserFollowers from "../db/models/UserFollowers.js";
import FavoriteRecipe from "../db/models/FavoriteRecipe.js"

const { JWT_SECRET } = process.env;

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {
    const { email, password, name } = payload;

    const existingUser = await findUser({ email } );
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = gravatar.url(email, { s: "250", d: "robohash" }, true);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    const tokenPayload = {
      id: newUser.id,
    };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });
  
  newUser.token = token;
  await newUser.save();
  


  return { token, user: newUser, }
  };

export const loginUser = async (payload = {}) => {
    const { email, password } = payload;
    const existingUser = await findUser({ email } );

    if (!existingUser) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(
      password,
      existingUser.password
    );
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
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
        password: existingUser.password,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      },
    };
  };

export const getUserDetails = async (currentUserId, targetUserId) => {
  const user = await findUser({ id: targetUserId });
  if (!user) throw HttpError(404, "User not found");

  const [recipeCount, followerCount] = await Promise.all([
    Recipe.count({ where: { owner: user.id } }),
    UserFollowers.count({ where: { followingId: user.id } }),
  ]);

  if (currentUserId === user.id) {
    const [favoriteCount, followingCount] = await Promise.all([
      FavoriteRecipe.count({ where: { userId: user.id } }),
      UserFollowers.count({ where: { followerId: user.id } }),
    ]);

    return {
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      recipes: recipeCount,
      followers: followerCount,
      favorites: favoriteCount,
      following: followingCount,
    };
  }

  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
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
};

export const getFollowers = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const user = await findUser({ id: userId });
  if (!user) {
    throw HttpError(404, "Not found");
  }

  const followers = await user.getFollowers({
    offset,
    limit,
    attributes: ["id", "name", "avatar"],
  });

  //  кількість рецептів і 3 фото
  const result = await Promise.all(
    followers.map(async (follower) => {
      const recipeCount = await Recipe.count({
        where: { owner:follower.id },
      });

      const recipes = await Recipe.findAll({
        where: { owner: follower.id },
        attributes: ["thumb"],
        limit: 3,
      })

      return {
        id: follower.id,
        name: follower.name,
        avatar: follower.avatar,
        recipesCount: recipeCount,
        recipesPreview: recipes.map((r) => r.thumb), 
      };
    })
  );

  const totalFollowers = await user.countFollowers();

  return {
    total: totalFollowers,
    page,
    limit,
    followers: result,
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
        attributes: ["thumb"],
      });

      return {
        id: followedUser.id,
        name: followedUser.name,
        avatar: followedUser.avatar,
        recipesCount: await followedUser.countRecipes(),
        recipesPreview: recipes.map((r) => r.thumb),
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
  const user = await findUser({ email } );
  if (!user || !user.token) {
    throw HttpError(401, "Not found");
  }

  await user.update({ token: null });
};

