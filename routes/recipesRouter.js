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

recipesRouter.get("/", recipesController.getRecipesByFilterController);

recipesRouter.get("/:id", recipesController.getRecipeController);

recipesRouter.get("/popular", recipesController.getPopularController);

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
