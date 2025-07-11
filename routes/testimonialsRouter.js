import express from "express";
import { getTestimonialsController } from "../controllers/testimonialsController.js";

const testimonialsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: API endpoints for managing testimonials
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of all testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Testimonials'
 *
 */

testimonialsRouter.get("/", getTestimonialsController);

export default testimonialsRouter;
