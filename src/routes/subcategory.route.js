import e from "express";

import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/fileUpload.middleware.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createSubcategory, deleteSubcategory, getSubcategories, getSubcategory, updateSubCategory } from "../controllers/subcategory.controller.js";
import { createSubcategorySchema } from "../vallidators/subcategory.validator.js";


const router = e.Router();
router
  .route("/subcategories")
  .get(auth, getSubcategories)
  .post(auth, upload.single("image"), validationMiddleware(createSubcategorySchema), createSubcategory);

router
  .route("/subcategories/:slugParam")
  .get(auth, getSubcategory)
  .put(auth, upload.single("image"), validationMiddleware(createSubcategorySchema), updateSubCategory).delete(auth, deleteSubcategory);

export default router;
