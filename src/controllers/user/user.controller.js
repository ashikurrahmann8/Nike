import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const signup = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  return res.json({ user });
});

export { signup };