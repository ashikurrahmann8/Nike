import e from "express";
import { createGroup } from "../controllers/group.controller.js";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/fileUpload.middleware.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createCategorySchema } from "../vallidators/category.validator.js";

const router = e.Router();
router
  .route("/groups")
  .post(auth, upload.single("image"), validationMiddleware(createCategorySchema), createGroup);

export default router;
