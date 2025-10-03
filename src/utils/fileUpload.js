import { v2 as cloudinary } from "cloudinary";
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "../constants/constants.js";
import ApiError from "./apiError.js";
import { unlinkSync } from "fs";

// Configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

// Upload an image
const fileUpload = async (file, options) => {
  try {
    const data = await cloudinary.uploader.upload(file, { ...options });
    unlinkSync(file);
    return data;
  } catch (error) {
    unlinkSync(file);
    throw ApiError.serverError(error.message);
  }
};

export { fileUpload };

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);
