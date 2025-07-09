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
 *               - categoryId
 *               - areaId
 *               - instructions
 *               - description
 *               - time
 *               - ingredients
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Classic Beef Lasagna"
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *               areaId:
 *                 type: integer
 *                 example: 7
 *               instructions:
 *                 type: string
 *                 example: "1. Brown the beef with onions and garlic. 2. Stir in tomato sauce and seasonings. Simmer for 15 minutes. 3. In a separate bowl, mix ricotta cheese, egg, and parsley. 4. Layer lasagna noodles, meat sauce, ricotta mixture, and mozzarella cheese in a baking dish. 5. Repeat layers. 6. Bake at 375°F (190°C) for 45 minutes until bubbly and golden brown. Let stand for 10 minutes before serving."
 *               description:
 *                 type: string
 *                 example: "A rich and cheesy homemade lasagna with a savory beef and tomato sauce. Perfect for a family dinner."
 *               time:
 *                 type: string
 *                 example: "90 minutes"
 *               thumb:
 *                 type: string
 *                 format: binary
 *                 description: "Recipe image file (optional)."
 *               ingredients:
 *                 type: string
 *                 description: "A JSON string of an array of ingredients. Example: '[{\"id\": 265, \"measure\": \"1 pound\"}, {\"id\": 114, \"measure\": \"1 large\"}, {\"id\": 143, \"measure\": \"15 ounces\"}]'"
 *                 example: "[{\"id\": 265, \"measure\": \"1 pound ground beef\"}, {\"id\": 114, \"measure\": \"1 chopped onion\"}, {\"id\": 143, \"measure\": \"1 (24 ounce) jar pasta sauce\"}, {\"id\": 23, \"measure\": \"15 ounces ricotta cheese\"}, {\"id\": 1, \"measure\": \"1 beaten egg\"}, {\"id\": 34, \"measure\": \"1/2 cup grated Parmesan cheese\"}, {\"id\": 10, \"measure\": \"12 lasagna noodles, cooked\"}, {\"id\": 25, \"measure\": \"4 cups shredded mozzarella cheese\"}]"
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
