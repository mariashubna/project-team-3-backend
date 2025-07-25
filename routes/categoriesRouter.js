import express from "express";
import categoriesController from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Category'
 * 
 */
categoriesRouter.get("/", categoriesController.getCategoriesController);

export default categoriesRouter;
