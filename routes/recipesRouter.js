import express from "express";
import recipesController from "../controllers/recipesController.js";
import validateRecipeBody from "../helpers/validateRecipeBody.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";
import {
  createRecipeSchema,
} from "../schemas/recipesSchemas.js";

const recipesRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Managing Recipes API
 */

/**
 * @swagger
 * /api/recipes/:
 *   get:
 *     summary: Search recipes by ingredient name, area name, category name and pagination
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name (like and case-insensitive)
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Filter by ingredient name (like and case-insensitive)
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filter by area name (like and case-insensitive)
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *         description: Filter by owner ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated results of recipes matching the given criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of matching recipes
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Error'
 */
recipesRouter.get("/", recipesController.getRecipesByFilterController);

/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     summary: Get most popular recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Most popular recipes list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of matching recipes
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Error'
 */
recipesRouter.get("/popular", recipesController.getPopularController);


/**
 * @swagger
 * /api/recipes/myfavorites:
 *   get:
 *     summary: Get favorite recipes for current user
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: A list of favorite recipes for current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of matching recipes
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized (no or invalid JWT)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Error'
 */
recipesRouter.get(
  "/myfavorites",
  authenticate,
  recipesController.getMyFavoriteController
);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id of the recipe
 *     responses:
 *       200:
 *         description: Recipe found successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Error'
 */
recipesRouter.get("/:id", recipesController.getRecipeController);

recipesRouter.post(
  "/",
  authenticate,
  upload.single("thumb"),
  validateRecipeBody(createRecipeSchema),
  recipesController.addRecipeController
);

recipesRouter.delete(
  "/:id",
  authenticate,
  recipesController.removeRecipeController
);

recipesRouter.get(
  "/myrecipes",
  authenticate,
  recipesController.getMyRecipeController
);

/**
 * @swagger
 * /api/recipes/{id}/favorites:
 *   post:
 *     summary: Add the recipe to favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id of the recipe
 *     responses:
 *       200:
 *         description: Recipe added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: id of the recipe added to favorites
 *       401:
 *         description: Unauthorized (no or invalid JWT)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Error'
 */
recipesRouter.post(
  "/:id/favorites",
  authenticate,
  recipesController.addFavoriteController
);

/**
 * @swagger
 * /api/recipes/{id}/favorites:
 *   delete:
 *     summary: Remove the recipe from favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id of the recipe
 *     responses:
 *       200:
 *         description: Recipe removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: id of the recipe removed from favorites
 *       401:
 *         description: Unauthorized (no or invalid JWT)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Error'
 */
recipesRouter.delete(
  "/:id/favorites",
  authenticate,
  recipesController.removeFavoriteController
);


export default recipesRouter;
