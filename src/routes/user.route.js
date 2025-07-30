import e from "express";
import { signup, verifymail } from "../controllers/user/user.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { userSignupSchema } from "../vallidators/user.vallidator.js";

const router = e.Router();
router.post("/users/signup", validationMiddleware(userSignupSchema), signup);
router.get("/users/verify/", verifymail);

export default router;
