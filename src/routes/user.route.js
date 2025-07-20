import e from "express";
import { signup } from "../controllers/user/user.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { userSignupSchema } from "../vallidators/user.vallidator.js";

const router = e.Router();
router.post("/users/signup", validationMiddleware(userSignupSchema), signup);
export default router;
