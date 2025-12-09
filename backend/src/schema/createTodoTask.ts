import { z } from "zod";

export const createTaskBody = z.object({
  title: z.string().nonempty('Title can not be empty'),
  description: z.string().optional(),
});