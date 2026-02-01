import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string(),
});

export { createGroupSchema };
