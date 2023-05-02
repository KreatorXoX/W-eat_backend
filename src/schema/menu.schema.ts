import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// creating a new category schema
export const newCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Category name is required" }),
    products: z
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
    extras: z
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
export type NewCategoryInput = z.TypeOf<typeof newCategorySchema>["body"];

// creating a new product schema
export const newProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Product name is required" }),
    description: z
      .string()
      .nonempty()
      .min(10, "Must be 10 or more characters long"),
    ingridients: z
      .string()
      .nonempty()
      .min(10, "Must be 10 or more characters long"),
    allergen: z.string().nonempty().optional(),
    tag: z.string().nonempty().optional(),
    sizes: z.array(z.object({ size: z.string(), price: z.number() })),
    category: z
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
export type NewProductInput = z.TypeOf<typeof newProductSchema>["body"];

// creating a new extra schema
export const newExtraSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Product name is required" }),
    paid: z.boolean(),
    extraItems: z
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
export type NewExtraInput = z.TypeOf<typeof newExtraSchema>["body"];

// creating a new extraItem schema
export const newExtraItemSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "ExtraItem name is required" }),
    price: z.number().min(0).optional(),
    allergen: z.string().nonempty().optional(),
  }),
});
export type NewExtraItemInput = z.TypeOf<typeof newExtraItemSchema>["body"];
