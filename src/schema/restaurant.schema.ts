import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// create restaurant schema
export const newRestaurantSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Restaurant name is required" }),
    address: z.string({ required_error: "Address is required" }),
    email: z.string().nonempty().optional(),
    backgroundImage: z.string().nonempty().optional(),
    minDeliveryAmount: z.number().min(1),
    averageDeliveryTime: z.number().min(1),
    deliveryCost: z.number().min(1),
    operationTime: z.object({
      openingTime: z.string().nonempty(),
      closingTime: z.string().nonempty(),
    }),
    reviews: z
      .array(
        z.string().transform((id, ctx) => {
          if (!isValidObjectId(id)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Not a valid id",
            });

            return z.NEVER;
          }
          return new mongoose.Types.ObjectId(id);
        })
      )
      .optional(),
  }),
});
export type NewRestaurantInput = z.TypeOf<typeof newRestaurantSchema>["body"];

// update restaurant schema
export const updateRestaurantSchema = z.object({
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
    name: z.string().optional(),
    address: z.string().optional(),
    email: z.string().nonempty().optional(),
    backgroundImage: z.string().nonempty().optional(),
    minDeliveryAmount: z.number().min(1).optional(),
    averageDeliveryTime: z.number().min(1).optional(),
    deliveryCost: z.number().min(1).optional(),
    operationTime: z
      .object({
        openingTime: z.string().nonempty().optional(),
        closingTime: z.string().nonempty().optional(),
      })
      .optional(),
  }),
});
export type UpdateRestaurantInput = z.TypeOf<typeof updateRestaurantSchema>;

// delete restaurant by the provided id schema
export const deleteRestaurantSchema = z.object({
  params: z.object({
    id: z.string().transform((id, ctx) => {
      if (!isValidObjectId(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not a valid id",
        });

        return z.NEVER;
      }
      return new mongoose.Types.ObjectId(id);
    }),
  }),
});
export type DeleteRestaurantInput = z.TypeOf<
  typeof deleteRestaurantSchema
>["params"];
