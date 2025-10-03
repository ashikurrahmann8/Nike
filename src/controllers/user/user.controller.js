// import { user } from "react";
import { email, overwrite, url } from "zod";
import {
  APP_URL,
  GOOGLE_ACCESS_TOKEN_URL,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_SCOPES,
  GOOGLE_OAUTH_URL,
  GOOGLE_TOKEN_INFO_URL,
  JWT_SECRET,
} from "../../constants/constants.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import ApiSuccess from "../../utils/apiSuccess.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendMail, forgotPasswordFormat, verifyEmailFormat } from "../../utils/mail.js";
import jwt from "jsonwebtoken";
import { fileUpload } from "../../utils/fileUpload.js";

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
    mailFormat: verifyEmailFormat(name, verifyUrl),
  });

  return res.status(200).json(ApiSuccess.created("User created", user));
});

const verifymail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw ApiError.badRequest("Token is required");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired access token");
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
  if (user.isVerified === false) {
    throw ApiError.forbidden("Email is not verified");
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

const signinWithGoogle = asyncHandler(async (req, res) => {
  const state = "some_state";
  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  const data = {
    code,

    client_id: GOOGLE_CLIENT_ID,

    client_secret: GOOGLE_CLIENT_SECRET,

    redirect_uri: GOOGLE_CALLBACK_URL,

    grant_type: "authorization_code",
  };

  const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
    method: "POST",

    body: JSON.stringify(data),
  });

  const access_token_data = await response.json();
  const { id_token } = access_token_data;

  const token_info_response = await fetch(`${GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`);
  const token_info = await token_info_response.json();
  const createdUser = await User.findOneAndUpdate(
    { email: token_info.email },
    {
      userName: (token_info.name + Math.floor(1000 + Math.random() * 9000)).replace(" ", ""),
      name: token_info.name,
      email: token_info.email,
      isVerified: token_info.email_verified,
      accountType: "google",
      avatar: {
        url: token_info.picture,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  const user = await User.findById(createdUser._id).select(
    "-__v -updatedAt -createdAt -password -passwordResetToken -passwordResetExpires"
  );
  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };
  res
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .status(token_info_response.status)
    .json(ApiSuccess.ok("User signed in", { accessToken, refreshToken }));
});

const updateUser = asyncHandler(async (req, res) => {
  const { userName, name, email } = req.body;
  const user = await User.findById(req.user._id);
  if (user.userName !== userName) {
    const isUserNameExists = await User.findOne({ userName });
    if (isUserNameExists) {
      throw ApiError.badRequest("Username already exists");
    } else {
      user.userName = userName;
    }
  }
  if (user.email !== email) {
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      throw ApiError.badRequest("Email already exists");
    } else {
      user.isVerified = false;
      user.email = email;
      const token = user.jwtToken();
      const verifyUrl = `${APP_URL}/api/v1/users/verify?token=${token}`;
      sendMail({
        email,
        subject: "Verify your email",
        mailFormat: verifyEmailFormat(name, verifyUrl),
      });
    }
  }
  user.name = name;
  await user.save();
  return res.status(200).json(ApiSuccess.ok("User updated", user));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  if (oldPassword === newPassword) {
    throw ApiError.badRequest("New password cannot be same as old password");
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw ApiError.notFound("Old password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json(ApiSuccess.ok("Password updated"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  sendMail({
    email,
    subject: "Reset password",
    mailFormat: forgotPasswordFormat(user.name, otp),
  });

  user.passwordResetToken = otp;
  user.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  await user.save();
  return res.status(200).json(ApiSuccess.ok("Otp sent"));
});

const validateOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({ passwordResetToken: otp });
  if (!user) {
    throw ApiError.notFound("Invalid otp");
  }
  if (user.passwordResetExpires < Date.now()) {
    throw ApiError.notFound("Otp expired");
  }
  return res.status(200).json(ApiSuccess.ok("Otp verified"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { otp, password } = req.body;
  const user = await User.findOne({ passwordResetToken: otp });
  if (!user) {
    throw ApiError.notFound("Invalid otp");
  }
  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  return res.status(200).json(ApiSuccess.ok("Password reset"));
});

const avatarUpload = asyncHandler(async (req, res) => {
  const avatar = req.file;
  const user = req.user;

  const result = await fileUpload(avatar.path, {
    folder: "avatar",
    use_filename: true,
    resource_type: "image",
    overwrite: true,
    transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face", radius: "max" }],
    public_id: req.user._id,
  });
  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  await user.save();
  return res.status(200).json(ApiSuccess.ok("Avatar uploaded", user));
});

const me = asyncHandler(async (req, res) => {
  return res.status(200).json(ApiSuccess.ok("User found", req.user));
});

export {
  signup,
  verifymail,
  signin,
  signout,
  updateUser,
  updatePassword,
  forgotPassword,
  validateOtp,
  resetPassword,
  signinWithGoogle,
  googleCallback,
  avatarUpload,
  me,
};
