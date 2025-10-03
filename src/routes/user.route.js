import e from "express";
import {
  avatarUpload,
  forgotPassword,
  googleCallback,
  me,
  resetPassword,
  signin,
  signinWithGoogle,
  signout,
  signup,
  updatePassword,
  updateUser,
  validateOtp,
  verifymail,
} from "../controllers/user/user.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import {
  userForgotPasswordOtpSchema,
  userForgotPasswordSchema,
  userPasswordUpdateSchema,
  userResetPasswordSchema,
  userSigninSchema,
  userSignupSchema,
  userUpdateSchema,
} from "../vallidators/user.vallidator.js";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/fileUpload.middleware.js";

const router = e.Router();
router.post("/signup", validationMiddleware(userSignupSchema), signup);
router.get("/verify/", verifymail);
router.post("/signin", validationMiddleware(userSigninSchema), signin);
router.get("/signout", auth, signout);
router.post("/update", auth, validationMiddleware(userUpdateSchema), updateUser);
router.post(
  "/update-password",
  auth,
  validationMiddleware(userPasswordUpdateSchema),
  updatePassword
);
router.post("/forgot-password", validationMiddleware(userForgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validationMiddleware(userForgotPasswordOtpSchema), validateOtp);
router.post("/reset-password", validationMiddleware(userResetPasswordSchema), resetPassword);
router.get("/google-signin", signinWithGoogle);
router.get("/google/callback", googleCallback);
router.post("/avatar-upload", auth, upload.single("avatar"), avatarUpload);
router.get("/me", auth, me);

export default router;
