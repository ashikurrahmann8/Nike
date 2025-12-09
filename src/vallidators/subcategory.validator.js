import { z } from "zod";

const createSubcategorySchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  category: z.string(),
});

const subcategoryImageSchema = z.object({
  image: z.any(),
});

export { createSubcategorySchema, subcategoryImageSchema };
