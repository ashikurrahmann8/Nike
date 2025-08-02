import e from "express";
import { signin, signout, signup, verifymail } from "../controllers/user/user.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { userSigninSchema, userSignupSchema } from "../vallidators/user.vallidator.js";
import auth from "../middlewares/auth.middleware.js";

const router = e.Router();
router.post("/signup", validationMiddleware(userSignupSchema), signup);
router.get("/verify/", verifymail);
router.post("/signin", validationMiddleware(userSigninSchema), signin);
router.get("/signout", auth, signout);

export default router;
