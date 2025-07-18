import fs from "fs/promises";
import path from "path";

const BASE_URL = process.env.APP_URL || `http://localhost:3000`;

const avatarsDir = path.resolve("public", "avatars");

export const saveAvatarToPublic = async (userId, tempPath, originalName) => {
  const ext = path.extname(originalName);
  const uniqueName = `${userId}_${Date.now()}${ext}`;
  const finalPath = path.join(avatarsDir, uniqueName);

  await fs.rename(tempPath, finalPath);

  return `${BASE_URL}/avatars/${uniqueName}`;
};
