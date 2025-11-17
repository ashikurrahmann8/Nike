import { Category } from "../models/index.model.js";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUpload } from "../utils/fileUpload.js";
import { categoryImageSchema } from "../vallidators/category.validator.js";

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find();
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
  let { name, slug } = req.body;
  const isNameExists = await Category.findOne({ name });
  if (isNameExists) {
    throw ApiError.badRequest("Category name already exist");
  }
  const isSlugExists = await Category.findOne({ slug });
  if (isSlugExists) {
    throw ApiError.badRequest("Category slug already exists");
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(" ", "-");
  }
  const result = await fileUpload(image.path, {
    folder: "categories",
    use_filename: true,
    resource_type: "image",
    overwrite: true,
    public_id: name,
  });

  const category = await Category.create({
    name,
    slug,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  });
  return res.status(201).json(ApiSuccess.ok("Category created", category));
});

const getCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const category = await Category.find({ slug: slugParam }).populate("subcategories");
  if (!category) {
    throw ApiError.notFound("Category not found");
  }
  return res.status(200).json(ApiSuccess.ok("Category fetched", category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const { name, slug } = req.body;
  const category = await Category.findOne({ slug: slugParam });
  if (!category) {
    throw ApiError.notFound("Category not found");
  }
  const isNameExists = await Category.findOne({ _id: { $ne: category._id }, name });
  if (isNameExists) {
    throw ApiError.badRequest("Category name already exist");
  }
  const isSlugExists = await Category.findOne({ _id: { $ne: category._id }, slug });
  if (isSlugExists) {
    throw ApiError.badRequest("Category slug already exists");
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(" ", "-");
  }

  const image = req.file;

  if (image) {
    const result = await fileUpload(image.path, {
      folder: "categories",
      use_filename: true,
      resource_type: "image",
      overwrite: true,
      public_id: name,
    });
    category.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  category.name = name;
  category.slug = slug;

  await category.save();
  return res.status(200).json(ApiSuccess.ok("Category updated", category));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const category = await Category.findOneAndDelete({ slug: slugParam });
  if (!category) {
    throw ApiError.notFound("Category not found");
  }
  return res.status(200).json(ApiSuccess.ok("Category deleted"));
});

export { getCategories, createCategory, getCategory, updateCategory, deleteCategory };
