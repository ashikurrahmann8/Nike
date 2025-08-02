import { APP_URL, JWT_SECRET } from "../../constants/constants.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import ApiSuccess from "../../utils/apiSuccess.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendMail, verifyEmail } from "../../utils/mail.js";
import jwt from "jsonwebtoken";

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
  const verifyUrl = `${APP_URL}/api/v1/users/verify?token=${token}`;
  sendMail({
    email,
    subject: "Verify your email",
    mailFormat: verifyEmail(name, verifyUrl),
  });

  return res.status(200).json(ApiSuccess.created("User created", user));
});

const verifymail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw ApiError.badRequest("Token is required");
  }

  const decodedToken = jwt.verify(token, JWT_SECRET);
  if (!decodedToken) {
    throw ApiError.badRequest("Invalid token");
  }

  const user = await User.findById(decodedToken.id).select(
    "-__v -updatedAt -createdAt -password -passwordResetToken -passwordResetExpires"
  );

  if (!user) {
    throw ApiError.notFound("User not found");
  }
  if (user.isVerified) {
    return res.status(200).json(ApiSuccess.ok("User is already verified", user));
  } else {
    user.isVerified = true;
    await user.save();
    return res.status(200).json(ApiSuccess.ok("User verified", user));
  }
});

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("Invalid credentials");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.notFound("Invalid credentials");
  }
  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json(ApiSuccess.ok("User signed in", { accessToken, refreshToken }));
});

const signout = asyncHandler(async (_req, res) => {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(ApiSuccess.ok("User signed out"));
});

export { signup, verifymail, signin, signout };
