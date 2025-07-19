import express from "express";
import ingredientsController from "../controllers/ingredientsController.js";

const ingredientsRouter = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Get all ingredients
 *     description: Returns a list of all available ingredients
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name (case-insensitive) assigned reciepts
  *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filter by area name (case-insensitive) assigned reciepts
 *       - in: query
 *         name: assignedToRecipes
 *         schema:
 *           type: boolean
 *         description: Filter areas that are assigned to recipes
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Tomato"
 *                   category:
 *                     type: string
 *                     example: "Vegetables"
 *       500:
 *         description: Internal Server Error
 */
ingredientsRouter.get("/", ingredientsController.getIngredientsController);

export default ingredientsRouter;
