import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllCategories } from "../services/categoriesServices.js";

const getCategoriesController = async (req, res, next) => {
  // розписати сервіс getAllCategories
  const result = await getAllCategories();
  res.json(result);
};

export default {
  getCategoriesController: ctrlWrapper(getCategoriesController),
};
