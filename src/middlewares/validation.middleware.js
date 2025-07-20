import { success, z, ZodError } from "zod";
import ApiError from "../utils/apiError.js";

function validationMiddleware(schema) {
  return async (req, res, next) => {
    try {
      const validateData = schema.parse(req.body);
      req.body = validateData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const { fieldErrors } = z.flattenError(error);
        throw ApiError.badRequest("ValidationError", fieldErrors);
        // return res.status(400).json({ success: false, errors: error.ZodError });
      } else {
        throw ApiError.serverError(error.message);
      }
    }
  };
}

export default validationMiddleware;
