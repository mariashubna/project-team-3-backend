import express from "express";
import areasController from "../controllers/areasController.js";

const areasRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: API endpoints for managing areas (regions)
 */

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Get all areas (regions of origin)
 *     tags: [Areas]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name (case-insensitive) assigned reciepts
  *       - in: query
 *         name: ingridient
 *         schema:
 *           type: string
 *         description: Filter by ingridient name (case-insensitive) assigned reciepts
 *       - in: query
 *         name: assignedToRecipes
 *         schema:
 *           type: boolean
 *         description: Filter areas that are assigned to recipes
 *     responses:
 *       200:
 *         description: List of all areas (regions)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 */

areasRouter.get("/", areasController.getAreasController);

export default areasRouter;
