import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { getAllTestimonials } from "../services/testimonialsServices.js";

const getTestimonials = async (req, res, next) => {
  const result = await getAllTestimonials();
  res.json(result);
};

export const getTestimonialsController = ctrlWrapper(getTestimonials);
