import Testimonial from "../db/models/Testimonial.js";
import User from "../db/models/User.js";
import "../db/models/associations.js";

export const getAllTestimonials = async () => {
  const testimonials = await Testimonial.findAll({
    include: {
      model: User,
      as: "user",
      attributes: ["name"],
    },
    order: [["createdAt", "DESC"]],
  });

  return testimonials.map((item) => ({
    username: item.user.name,
    testimonial: item.testimonial,
  }));
};
