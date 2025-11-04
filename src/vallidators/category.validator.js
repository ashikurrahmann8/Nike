import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
});

const categoryImageSchema = z.object({
  image: z.any(),
});

export { createCategorySchema, categoryImageSchema };
