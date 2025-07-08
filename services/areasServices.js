import Area from "../db/models/Area.js";
import HttpError from "../helpers/HttpError.js";

export const getAllAreas = async () => {
    const areas = await Area.findAll({ attributes: ["id", "name"], raw: true });
    if (!areas || areas.length === 0) {
        throw HttpError(404, "No areas found");
  }
  return areas;

};
