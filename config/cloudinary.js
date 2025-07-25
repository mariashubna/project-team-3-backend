import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "so-yummy/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 250, height: 250, crop: "fill" }],
  },
});

const recipeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "so-yummy/recipes",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

export { cloudinary, avatarStorage, recipeStorage };
