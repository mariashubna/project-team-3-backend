import multer from "multer";
import HttpError from "../helpers/HttpError.js";
import { avatarStorage, recipeStorage } from "../config/cloudinary.js";

// Обмеження розміру файлу
const limits = {
  fileSize: 1024 * 1024 * 10, // 10 МБ
};

// Фільтр для перевірки типу файлу
const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop().toLowerCase();
  
  // Дозволяємо тільки зображення форматів .jpg, .jpeg та .png
  const allowedExtensions = ["jpg", "jpeg", "png"];
  
  if (!allowedExtensions.includes(extension)) {
    return cb(HttpError(400, `Unsupported file format. Allowed formats: ${allowedExtensions.join(", ")}`))
  }
  
  cb(null, true);
};

// Middleware для завантаження аватарок
const uploadAvatar = multer({
  storage: avatarStorage,
  limits,
  fileFilter,
});

// Middleware для завантаження зображень рецептів
const uploadRecipeImage = multer({
  storage: recipeStorage,
  limits,
  fileFilter,
});

export { uploadAvatar, uploadRecipeImage };
export default uploadAvatar; // Для зворотної сумісності
