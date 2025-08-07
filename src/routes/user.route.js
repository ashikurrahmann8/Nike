import e from "express";
import {
  forgotPassword,
  signin,
  signout,
  signup,
  updatePassword,
  updateUser,
  verifymail,
} from "../controllers/user/user.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import {
  userForgotPasswordSchema,
  userPasswordUpdateSchema,
  userSigninSchema,
  userSignupSchema,
  userUpdateSchema,
} from "../vallidators/user.vallidator.js";
import auth from "../middlewares/auth.middleware.js";

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

export default router;
