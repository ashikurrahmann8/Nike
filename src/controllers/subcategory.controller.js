import { Subcategory } from "../models/subcategory.model.js";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUpload } from "../utils/fileUpload.js";
import { subcategoryImageSchema } from "../vallidators/subcategory.validator.js";

const getSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({
    $or: [{ createdBy: req.user._id }, { createdBy: null }],
  });
  if (subcategories.length === 0) {
    return res.status(200).json(ApiSuccess.ok("No subcategories found", subcategories));
  }
  return res.status(200).json(ApiSuccess.ok("Subcategories fetched", subcategories));
});

const createSubcategory = asyncHandler(async (req, res) => {
  const image = req.file;
  const validateImage = subcategoryImageSchema.safeParse(image);
  if (validateImage.error) {
    throw ApiError.badRequest("Image is required");
  }
  let { name, slug, category } = req.body;
  const isNameExists = await Subcategory.findOne({ name });
  if (isNameExists) {
    throw ApiError.badRequest("Subcategory name already exist");
  }
  const isSlugExists = await Subcategory.findOne({ slug });
  if (isSlugExists) {
    throw ApiError.badRequest("Subcategory slug already exists");
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(" ", "-");
  }
  const result = await fileUpload(image.path, {
    folder: "subcategory",
    use_filename: true,
    resource_type: "image",
    overwrite: true,
    public_id: name,
  });

  const subcategory = await Subcategory.create({
    name,
    slug,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
    category,
    createdBy: req.user._id,
  });
  return res.status(201).json(ApiSuccess.ok("Subcategory created", subcategory));
});

const getSubcategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const subcategory = await Subcategory.find({ slug: slugParam });
  if (!subcategory) {
    throw ApiError.notFound("Subcategory not found");
  }
  return res.status(200).json(ApiSuccess.ok("Subcategory fetched", subcategory));
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const { name, slug, category } = req.body;
  const subcategory = await Subcategory.findOne({
    $and: [{ slug: slugParam }, { createdBy: req.user._id }],
  });
  if (!subcategory) {
    throw ApiError.notFound("Subcategory not found");
  }
  const isNameExists = await Subcategory.findOne({ _id: { $ne: subcategory._id }, name });
  if (isNameExists) {
    throw ApiError.badRequest("Subcategory name already exist");
  }
  const isSlugExists = await Subcategory.findOne({ _id: { $ne: subcategory._id }, slug });
  if (isSlugExists) {
    throw ApiError.badRequest("Subcategory slug already exists");
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(" ", "-");
  }

  const image = req.file;

  if (image) {
    const result = await fileUpload(image.path, {
      folder: "subcategories",
      use_filename: true,
      resource_type: "image",
      overwrite: true,
      public_id: name,
    });
    subcategory.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  subcategory.name = name;
  subcategory.slug = slug;
  subcategory.category = category;
  await subcategory.save();
  return res.status(200).json(ApiSuccess.ok("Subcategory updated", subcategory));
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const subcategory = await Subcategory.findOneAndDelete({
    $and: [{ slug: slugParam }, { createdBy: req.user._id }],
  });
  if (!subcategory) {
    throw ApiError.notFound("Subcategory not found");
  }
  return res.status(200).json(ApiSuccess.noContent("Subcategory deleted"));
});

export {
  getSubcategories,
  createSubcategory,
  getSubcategory,
  updateSubCategory,
  deleteSubcategory,
};
