import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// address schema
const addressSchema = z.object({
  street: z.string().nonempty("Street is required"),
  city: z.string().nonempty("City is required"),
  houseNumber: z.string().nonempty("House number is required"),
  postalCode: z.string().nonempty("Postal code is required"),
});

// finding user by the provided id schema
export const findUserByIdSchema = z.object({
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
export type FindUserByIdInput = z.TypeOf<typeof findUserByIdSchema>["params"];

// updating user schema
export const updateUserSchema = z.object({
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
    name: z
      .string()
      .nonempty({ message: "User name cannot be empty string" })
      .optional(),
    homeAddress: addressSchema.optional(),
    workAddress: addressSchema.optional(),
    otherAddress: addressSchema.optional(),
  }),
});
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
