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
        const formatted = error.issues.map((i) => ({
          field: i.path[0],
          message: i.message,
        }));
        throw ApiError.badRequest("Validation error", formatted);
      } else {
        throw ApiError.serverError(error.message);
      }
    }
  };
}  
export default validationMiddleware;
