import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { getAllTestimonials } from "../services/testimonialsServices.js";

const getTestimonialsController = async (req, res, next) => {
  // розписати сервіс getAllTestimonials
  const result = await getAllTestimonials();
  res.json(result);
};

export default {
  getTestimonialsController: ctrlWrapper(getTestimonialsController),
};
