import mongoose from "mongoose";
import { MONGO_URI } from "../constants/constants.js";
import ApiError from "../utils/apiError.js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
let id;

const dbConnection = async (attempt = 1) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error(`❌ Database connection failed (attempt: ${attempt}): ${error.message}`);

    if (attempt <= MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * 2 ** (attempt - 1);
      console.log(`🔁 Retrying in ${delay / 1000} seconds...`);

      clearInterval(id);
      id = setTimeout(() => {
        dbConnection(attempt + 1);
      }, delay);
    } else {
      console.error("Maximum retry attempts reached. Throwing error");
      throw ApiError.databaseError(error.message);
    }
  }
};

export default dbConnection;
