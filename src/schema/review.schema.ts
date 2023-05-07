import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// create review schema
export const newReviewSchema = z.object({
  body: z.object({
    user: z.string().transform((id, ctx) => {
      if (!isValidObjectId(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not a valid id",
        });

        return z.NEVER;
      }
      return new mongoose.Types.ObjectId(id);
    }),
    content: z
      .string()
      .nonempty({ message: "Review content cannot be empty string" })
      .optional(),
    rating: z
      .number()
      .min(1, "Rating cannot be less than 1")
      .max(5, "Rating cannot be more than 5"),
    response: z
      .string()
      .nonempty({ message: "Review response cannot be empty string" })
      .optional(),
  }),
});
export type NewReviewInput = z.TypeOf<typeof newReviewSchema>["body"];

// create response schema
export const newResponseSchema = z.object({
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
  body: z.object({
    content: z
      .string({ required_error: "Response is required" })
      .nonempty({ message: "Response cannot be empty string" }),
  }),
});
export type NewResponseInput = z.TypeOf<typeof newResponseSchema>;
