import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const signup = asyncHandler(async (req, res) => {
  const { userName, name, email, password } = req.body;
});

export { signup };
