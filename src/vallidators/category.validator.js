import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string(),
});

const categoryImageSchema = z.object({
  image: z.any(),
});

export { createCategorySchema, categoryImageSchema };
