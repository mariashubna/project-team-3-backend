import fs from "fs/promises";
import path from "path";

const recipesImagesDir = path.resolve("public", "recipe-images");

// Створюємо директорію, якщо вона не існує
const ensureDirectoryExists = async (directory) => {
  try {
    await fs.access(directory);
  } catch (error) {
    await fs.mkdir(directory, { recursive: true });
  }
};

export const saveRecipeImage = async (recipeId, tempPath, originalName) => {
  await ensureDirectoryExists(recipesImagesDir);
  
  const ext = path.extname(originalName);
  const uniqueName = `recipe_${recipeId}_${Date.now()}${ext}`;
  const finalPath = path.join(recipesImagesDir, uniqueName);

  await fs.rename(tempPath, finalPath);

  return `/recipe-images/${uniqueName}`;
};
