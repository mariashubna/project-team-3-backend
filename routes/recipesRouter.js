import express from "express";
import recipesController from "../controllers/recipesController.js";
import validateRecipeBody from "../helpers/validateRecipeBody.js";
import authenticate from "../middleware/authenticate.js";
import { uploadRecipeImage } from "../middleware/upload.js";
import { createRecipeSchema } from "../schemas/recipesSchemas.js";

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

recipesRouter.get("/popular", recipesController.getPopularController);

/**
 * @swagger
 * /api/recipes/myrecipes:
 *   get:
 *     summary: Get user's own recipes
 *     description: Retrieve a list of recipes created by the authenticated user with pagination
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recipes per page
 *     responses:
 *       '200':
 *         description: A list of user's recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 1
 *                   description: Total number of recipes
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 288
 *                       title:
 *                         type: string
 *                         example: "Ukrainian Borscht"
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           name:
 *                             type: string
 *                             example: "Miscellaneous"
 *                       instructions:
 *                         type: string
 *                         example: "1. Boil a meat broth. 2. Prepare vegetables: cut cabbage, grate beets, cut celery. 3. Sauté celery. 4. Add all ingredients to the broth and cook until tender. 5. Serve with sour cream and green onions."
 *                       description:
 *                         type: string
 *                         example: "Traditional Ukrainian borscht with cabbage and beets"
 *                       image:
 *                         type: string
 *                         example: "/temp/1752110012880_166972169_receipt1.jpg"
 *                       time:
 *                         type: string
 *                         example: "120"
 *                       owner:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "recetas"
 *                           avatar:
 *                             type: string
 *                             example: "https://s.gravatar.com/avatar/828d27f5e9899b39881bfcac736dde89?s=250&d=robohash"
 *                           email:
 *                             type: string
 *                             example: "1test@gmail.com"
 *                       ingredients:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             ingredient:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: "Cabbage"
 *                                 description:
 *                                   type: string
 *                                   example: "A leafy green or purple vegetable that is often used in salads, coleslaw, and stir-fry dishes, and is also commonly fermented into sauerkraut."
 *                                 image:
 *                                   type: string
 *                                   example: "https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e37f5.png"
 *                             measure:
 *                               type: string
 *                               example: "200g"
 *                       area:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Ukrainian"
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                   description: Total number of pages
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */
recipesRouter.get(
  "/myrecipes",
  authenticate,
  recipesController.getMyRecipeController
);

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
 *               - image
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
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The recipe's image file. Required.
 *               time:
 *                 type: string
 *                 example: "120"
 *               ingredients:
 *                 type: string
 *                 format: json
 *                 description: JSON string array of ingredient objects with id and measure
 *                 example: "[{\"id\": \"2\", \"measure\": \"200g\"}, {\"id\": \"9\", \"measure\": \"400g\"}, {\"id\": \"10\", \"measure\": \"300g\"}, {\"id\": \"6\", \"measure\": \"100g\"}]"
 *     responses:
 *       '201':
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 312
 *                 title:
 *                   type: string
 *                   example: "Ukrainian Borscht"
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     name:
 *                       type: string
 *                       example: "Miscellaneous"
 *                 instructions:
 *                   type: string
 *                   example: "1. Boil a meat broth. 2. Prepare vegetables: cut cabbage, grate beets, cut celery. 3. Sauté celery. 4. Add all ingredients to the broth and cook until tender. 5. Serve with sour cream and green onions."
 *                 description:
 *                   type: string
 *                   example: "Traditional Ukrainian borscht with cabbage and beets"
 *                 image:
 *                   type: string
 *                   example: "/temp/1752404434891_8063423_borscht.jpg"
 *                 time:
 *                   type: string
 *                   example: "120"
 *                 owner:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "recetas"
 *                     avatar:
 *                       type: string
 *                       example: "https://s.gravatar.com/avatar/828d27f5e9899b39881bfcac736dde89?s=250&d=robohash"
 *                     email:
 *                       type: string
 *                       example: "1test@gmail.com"
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ingredient:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           image:
 *                             type: string
 *                       measure:
 *                         type: string
 *                   example:
 *                     - ingredient:
 *                         id: 2
 *                         name: "Cabbage"
 *                         description: "A leafy green or purple vegetable that is often used in salads, coleslaw, and stir-fry dishes, and is also commonly fermented into sauerkraut."
 *                         image: "https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e37f5.png"
 *                       measure: "200g"
 *                     - ingredient:
 *                         id: 6
 *                         name: "Spring Onions"
 *                         description: "Also known as scallions or green onions, these are young onions that have a mild flavor and are commonly used as a garnish or ingredient in salads, soups, stir-fries, and other dishes."
 *                         image: "https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e3770.png"
 *                       measure: "100g"
 *                     - ingredient:
 *                         id: 9
 *                         name: "Tinned Tomatos"
 *                         description: "Tinned tomatoes are tomatoes that have been canned or preserved in a liquid. They are commonly used in sauces, soups, stews, and other culinary applications."
 *                         image: "https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e37e8.png"
 *                       measure: "400g"
 *                     - ingredient:
 *                         id: 10
 *                         name: "Minced Beef"
 *                         description: "Ground beef, commonly used for making burgers, meatballs, and meat sauces."
 *                         image: "https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e37c2.png"
 *                       measure: "300g"
 *                 area:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Ukrainian"
 *       '400':
 *         description: Bad request (validation error)
 *       '401':
 *         description: Unauthorized (token not provided or invalid)
 */
recipesRouter.post(
  "/",
  authenticate,
  uploadRecipeImage.single("image"),
  validateRecipeBody(createRecipeSchema),
  recipesController.addRecipeController
);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete own recipe
 *     description: Delete a recipe that belongs to the authenticated user
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the recipe to delete
 *     responses:
 *       '200':
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recipe deleted successfully"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 *       '404':
 *         description: Recipe not found or you don't have permission to delete it
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recipe not found or you don't have permission to delete it"
 */
recipesRouter.delete(
  "/:id",
  authenticate,
  recipesController.removeRecipeController
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
