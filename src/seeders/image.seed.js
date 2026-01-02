import fs from "fs";
import path from "path";
import { fileUpload } from "../utils/fileUpload.js";

const mainDirPath = path.resolve("public/images");

const getImagesPath = (dir) => fs.readdirSync(dir).map((file) => path.join(dir, file));

export const imageSeed = async () => {
  const data = await Promise.all(
    getImagesPath(mainDirPath).map(async (filePath) => {
      return await fileUpload(filePath, {
        folder: "seedingFiles",
        use_filename: true,
        resource_type: "image",
        overwrite: true,
      });
    })
  );
  return data;
};
