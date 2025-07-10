import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import authController from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const usersRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "Password123"
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "Password123"
 *
 *     UserDetails:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         recipes:
 *           type: integer
 *         followers:
 *           type: integer
 *         favorites:
 *           type: integer
 *         following:
 *           type: integer
 *
 *     FollowList:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         followers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               recipesCount:
 *                 type: integer
 *               recipesPreview:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *     FollowingList:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         following:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               recipesCount:
 *                 type: integer
 *               recipesPreview:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Managing Users API
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       400:
 *         description: Invalid input
 */
usersRouter.post(
  "/signup",
  validateBody(registerSchema),
  authController.registerController
);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
usersRouter.post(
  "/signin",
  validateBody(loginSchema),
  authController.loginController
);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/current", authenticate, authController.getCurrentController);

/**
 * @swagger
 * /api/users/details/{userId}:
 *   get:
 *     summary: Get detailed user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetails'
 *       404:
 *         description: User not found
 */
usersRouter.get(
  "/details/:userId",
  authenticate,
  authController.getDetailsController
);

/**
 * @swagger
 * /api/users/avatars:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 */
usersRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.avatarsController
);

/**
 * @swagger
 * /api/users/followers/{userId}:
 *   get:
 *     summary: Get user's followers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowList'
 */
usersRouter.get(
  "/followers/:userId",
  authenticate,
  authController.getFollowersController
);

/**
 * @swagger
 * /api/users/following:
 *   get:
 *     summary: Get list of users current user is following
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of followed users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowingList'
 */
usersRouter.get(
  "/following",
  authenticate,
  authController.getFollowingController
);

/**
 * @swagger
 * /api/users/follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
usersRouter.post(
  "/follow/:userId",
  authenticate,
  authController.followUserController
);

/**
 * @swagger
 * /api/users/unfollow/{userId}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfollow successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
usersRouter.delete(
  "/unfollow/:userId",
  authenticate,
  authController.unfollowUserController
);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User logged out successfully
 */
usersRouter.post("/logout", authenticate, authController.logoutController);

export default usersRouter;

