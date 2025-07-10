import express from "express";
import recipesController from "../controllers/recipesController.js";
import validateRecipeBody from "../helpers/validateRecipeBody.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";
import {
  createRecipeSchema,
  favoriteRecipe,
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
recipesRouter.get("/", recipesController.getRecipesByFilterController);

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recipe not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
recipesRouter.get("/:id", recipesController.getRecipeController);

recipesRouter.get("/popular", recipesController.getPopularController);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - area
 *               - instructions
 *               - description
 *               - thumb
 *               - time
 *               - ingredients
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ukrainian Borscht"
 *               category:
 *                 type: string
 *                 example: 'Miscellaneous'
 *               area:
 *                 type: string
 *                 example: 'Ukrainian'
 *               instructions:
 *                 type: string
 *                 example: "1. Boil a meat broth. 2. Prepare vegetables: cut cabbage, grate beets, cut celery. 3. Sauté celery. 4. Add all ingredients to the broth and cook until tender. 5. Serve with sour cream and green onions."
 *               description:
 *                 type: string
 *                 example: "Traditional Ukrainian borscht with cabbage and beets"
 *               thumb:
 *                 type: string
 *                 format: binary
 *                 description: The recipe's image file. Required.
 *               time:
 *                 type: string
 *                 example: "120"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "2"
 *                     measure:
 *                       type: string
 *                       example: "200g"
 *                 example: [{"id": "2", "measure": "200g"}, {"id": "9", "measure": "400g"}, {"id": "10", "measure": "300g"}, {"id": "6", "measure": "100g"}]
 *     responses:
 *       '201':
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       '400':
 *         description: Bad request (validation error)
 *       '401':
 *         description: Unauthorized (token not provided or invalid)
 */
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

recipesRouter.post(
  "/favorites",
  authenticate,
  validateBody(favoriteRecipe),
  recipesController.addFavoriteController
);

recipesRouter.delete(
  "/favorites",
  authenticate,
  validateBody(favoriteRecipe),
  recipesController.removeFavoriteController
);

recipesRouter.get(
  "/myfavorites",
  authenticate,
  recipesController.getMyFavoriteController
);

export default recipesRouter;
