import multer from "multer";
import HttpError from "../helpers/HttpError.js";
import { avatarStorage, recipeStorage } from "../config/cloudinary.js";

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop().toLowerCase();

  const allowedExtensions = ["jpg", "jpeg", "png"];

  if (!allowedExtensions.includes(extension)) {
    return cb(
      HttpError(
        400,
        `Unsupported file format. Allowed formats: ${allowedExtensions.join(
          ", "
        )}`
      )
    );
  }

  cb(null, true);
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits,
  fileFilter,
});

const uploadRecipeImage = multer({
  storage: recipeStorage,
  limits,
  fileFilter,
});

export { uploadAvatar, uploadRecipeImage };
export default uploadAvatar;
