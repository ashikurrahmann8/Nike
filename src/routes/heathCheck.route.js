import e from "express";
import { heathCheck } from "../controllers/heathCheck.controller.js";
const router = e.Router();

router.get("/", heathCheck);

export default router;
