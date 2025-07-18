import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllAreas } from "../services/areasServices.js";

const getAreasController = async (req, res, next) => {
  const result = await getAllAreas();
  res.json(result);
};

export default {
  getAreasController: ctrlWrapper(getAreasController),
};
