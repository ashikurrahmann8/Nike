import { Category } from "../models/catagory.model.js";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUpload } from "../utils/fileUpload.js";
import { categoryImageSchema } from "../vallidators/category.validator.js";

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().populate("subcategories");
  if (categories.length === 0) {
    return res.status(200).json(ApiSuccess.ok("No category found", categories));
  }
  return res.status(200).json(ApiSuccess.ok("Categories fetched", categories));
});

const createCategory = asyncHandler(async (req, res) => {
  const image = req.file;
  const validateImage = categoryImageSchema.safeParse(image);
  if (validateImage.error) {
    throw ApiError.badRequest("Image is required");
  }
  const { name } = req.body;
  const result = await fileUpload(image.path, {
    folder: "categories",
    use_filename: true,
    resource_type: "image",
    overwrite: true,
    public_id: name,
  });

  const category = await Category.create({
    name,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  });
  return res.status(201).json(ApiSuccess.ok("Category created", category));
});

export { getCategories, createCategory };
