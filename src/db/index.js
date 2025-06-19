import mongoose from "mongoose";
import { MONGO_URI } from "../constants/constants.js";
import ApiError from "../utils/apiError.js";

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("database connected");
  } catch (error) {
    throw ApiError.databaseError(error.message);
  }
};

export default dbConnection;
