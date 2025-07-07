import express from "express";
import areasController from "../controllers/areasController.js";

const areasRouter = express.Router();

areasRouter.get("/", areasController.getAreasController);

export default areasRouter;
