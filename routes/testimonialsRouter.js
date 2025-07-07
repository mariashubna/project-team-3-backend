import express from "express";
import { getTestimonialsController } from "../controllers/testimonialsController.js";

const testimonialsRouter = express.Router();

testimonialsRouter.get("/", getTestimonialsController);

export default testimonialsRouter;
