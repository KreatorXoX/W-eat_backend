import { z } from "zod";

// finding user by the provided id schema
export const findUserByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type FindUserByIdInpupt = z.TypeOf<typeof findUserByIdSchema>["params"];
