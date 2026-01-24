import ApiError from "../utils/apiError.js";
import { seedCategories } from "./categories&subcategories.seed.js";
import { imageSeed } from "./image.seed.js";

async function callSeeds() {
  try {
    await imageSeed();
    await seedCategories();
  } catch (error) {
    ApiError.serverError(error.message);
  }
}

callSeeds();
