import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import authController from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const usersRouter = express.Router();

usersRouter.post(
  "/signup",
  validateBody(registerSchema),
  authController.registerController
);

usersRouter.post(
  "/signin",
  validateBody(loginSchema),
  authController.loginController
);

//отримання інформації про поточного користувача
usersRouter.get("/current", authenticate, authController.getCurrentController);

// отримання детальної інформації про користувача
usersRouter.get(
  "/details/:userId",
  authenticate,
  authController.getDetailsController
);

// оновлення аватарки
usersRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.avatarsController
);

//отримання інформації про слідкувачів
usersRouter.get(
  "/followers/:userId",
  authenticate,
  authController.getFollowersController
);

usersRouter.get(
  "/following",
  authenticate,
  authController.getFollowingController
);

usersRouter.post(
  "/follow/:userId",
  authenticate,
  authController.followUserController
);

usersRouter.delete(
  "/unfollow/:userId",
  authenticate,
  authController.unfollowUserController
);

usersRouter.post("/logout", authenticate, authController.logoutController);

export default usersRouter;
