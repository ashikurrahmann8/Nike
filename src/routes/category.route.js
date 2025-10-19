import e from "express";
import { createCategory, getCategories } from "../controllers/category.controller.js";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/fileUpload.middleware.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createCategorySchema } from "../vallidators/category.validator.js";

const router = e.Router();
router
  .route("/categories")
  .get(auth, getCategories)
  .post(auth, upload.single("image"), validationMiddleware(createCategorySchema), createCategory);

export default router;
