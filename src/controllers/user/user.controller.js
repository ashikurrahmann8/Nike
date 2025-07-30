import { APP_URL } from "../../constants/constants.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import ApiSuccess from "../../utils/apiSuccess.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendMail, verifyEmail } from "../../utils/mail.js";

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

  const token = user.jwtToken();
  const verifyUrl = `${APP_URL}/api/v1/users/verify/?token=${token}`;
  sendMail({
    email,
    subject: "Verify your email",
    mailFormat: verifyEmail(name, verifyUrl),
  });

  return res.status(200).json(ApiSuccess.created("User created", user));
});

export { signup };
