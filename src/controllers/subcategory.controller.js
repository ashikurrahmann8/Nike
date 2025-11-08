
import { Subcategory } from "../models/index.model.js";
import ApiSuccess from "../utils/apiSuccess";

const getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find();
  if (subcategories.length === 0) {
    return res.status(200).json(ApiSuccess.ok("no subcategories found", subcategories));
  }
  return res.status(200).json(ApiSuccess.ok("Subcategories fetched", subcategories));
};

export { getSubcategories };
