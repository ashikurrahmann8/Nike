import e from "express";
import { signin, signup, verifymail } from "../controllers/user/user.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { userSigninSchema, userSignupSchema } from "../vallidators/user.vallidator.js";

const router = e.Router();
router.post("/users/signup", validationMiddleware(userSignupSchema), signup);
router.get("/users/verify/", verifymail);
router.post("/users/signin", validationMiddleware(userSigninSchema), signin);

export default router;
