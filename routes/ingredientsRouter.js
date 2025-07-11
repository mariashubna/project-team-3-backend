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
