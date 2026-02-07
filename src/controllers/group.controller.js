import { Group } from "../models/group.model.js";
import ApiSuccess from "../utils/apiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUpload } from "../utils/fileUpload.js";

const createGroup = asyncHandler(async (req, res) => {
  const groupLogo = req.file;
  if (groupLogo) {
    const result = await fileUpload(groupLogo.path, {
      folder: "groups",
      use_filename: true,
      resource_type: "image",
      overwrite: true,
      public_id: req.body.name + Date.now(),
    });
    req.body.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const group = await Group.create({ ...req.body, createdBy: req.user._id });
  return res.status(200).json(ApiSuccess.created("Group created", group));
});

export { createGroup };
