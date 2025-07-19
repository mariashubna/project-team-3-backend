import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllAreas } from "../services/areasServices.js";

const getAreasController = async (req, res, next) => {
  const {...filter} = req.query;
  const result = await getAllAreas({filter});
  res.json(result);
};

export default {
  getAreasController: ctrlWrapper(getAreasController),
};
