import { ACCESS_TOKEN_SECRET } from "../constants/constants";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken || res.header("Authorization").replace("Bearer ", "");
  if (!token) {
    throw ApiError.unauthorized("You are not logged in");
  }
  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    throw ApiError.unauthorized("You are not logged in");
  }
  const user = User.findById(decodedToken.id);
  if (!user) {
    throw ApiError.unauthorized("You are not logged in");
  }
  req.user = user;
  next();
});

export default auth;
