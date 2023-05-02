import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// finding document by the provided id schema
export const byIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((id, ctx) => {
        if (!isValidObjectId(id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not a valid id",
          });

          return z.NEVER;
        }
        return new mongoose.Types.ObjectId(id);
      })
      .optional(),
  }),
});
export type ByIdInput = z.TypeOf<typeof byIdSchema>["params"];
