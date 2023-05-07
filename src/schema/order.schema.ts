import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// create order schema
const OrderItem = z.object({
  product: z
    .string()
    .nonempty()
    .transform((id, ctx) => {
      if (!isValidObjectId(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not a valid id",
        });

        return z.NEVER;
      }
      return new mongoose.Types.ObjectId(id);
    }),
  extras: z.array(
    z
      .string()
      .nonempty()
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
      .optional()
  ),
  quantity: z.number().min(0),
  size: z.string().nonempty({ message: "Size has to be declared" }),
  note: z.string().optional(),
});

export const newOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(OrderItem),
    user: z
      .string()
      .nonempty()
      .transform((id, ctx) => {
        if (!isValidObjectId(id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not a valid id",
          });

          return z.NEVER;
        }
        return new mongoose.Types.ObjectId(id);
      }),
    address: z.string().nonempty({ message: "Address cannot be empty string" }),
    isFavourite: z.boolean().optional(),
    paymentMethod: z
      .string()
      .nonempty({ message: "Payment Method cannot be empty string" }),
    paymentId: z
      .string()
      .nonempty({ message: "Payment id cannot be empty string" })
      .optional(),
    paymentStatus: z.enum(["successful", "failed"]).optional(),
  }),
});
export type NewOrderInput = z.TypeOf<typeof newOrderSchema>["body"];
