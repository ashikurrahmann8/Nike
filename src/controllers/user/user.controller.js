import { User } from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import ApiSuccess from "../../utils/apiSuccess.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const signup = asyncHandler(async (req, res) => {
  const { userName, name, email, password } = req.body;
  const userNameExist = await User.findOne({ userName });
  if (userNameExist) {
    throw ApiError.badRequest("Username already exists");
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw ApiError.badRequest("Email already exists");
  }

  const createdUser = await User.create({ userName, name, email, password });

  const user = await User.findById(createdUser._id).select(
    "-__v -updatedAt -createdAt -password -passwordResetToken -passwordResetExpires"
  );

  return res.status(200).json(ApiSuccess.created("User created", user));
});

export { signup };
