import mongoose, { isValidObjectId } from "mongoose";
import { z } from "zod";

// creating a new category schema
export const newCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty({ message: "Product name cannot be empty string" }),
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

// updating category schema
export const updateCategorySchema = z.object({
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
      .nonempty({ message: "Product name cannot be empty string" })
      .optional(),
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
export type UpdateCategoryInput = z.TypeOf<typeof updateCategorySchema>;

// creating a new product schema
export const newProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty({ message: "Product name cannot be empty string" }),
    description: z
      .string()
      .nonempty({ message: "Product name cannot be empty string" })
      .min(10, "Must be 10 or more characters long"),
    ingridients: z
      .string()
      .nonempty({ message: "Product name cannot be empty string" })
      .min(10, "Must be 10 or more characters long"),
    allergens: z
      .string()
      .nonempty({ message: "Allergens cannot be empty string" })
      .transform((allergens, ctx) => {
        const allergensArray = allergens.split(",");
        if (!allergensArray) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "allergens should be seperated by a comma",
          });

          return z.NEVER;
        }
        return allergensArray;
      })
      .optional(),

    tag: z
      .string()
      .nonempty({ message: "Product name cannot be empty string" })
      .optional(),
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

// updating product schema
export const updateProductSchema = z.object({
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
      .nonempty({ message: "Product name cannot be empty string" })
      .optional(),
    description: z
      .string()
      .nonempty({ message: "Product name cannot be empty string" })
      .min(10, "Must be 10 or more characters long")
      .optional(),
    ingridients: z
      .string()
      .nonempty({ message: "Ingridients cannot be empty string" })
      .min(10, "Must be 10 or more characters long")
      .optional(),
    allergens: z
      .string()
      .nonempty({ message: "Allergen cannot be empty string" })
      .optional(),
    tag: z
      .string()
      .nonempty({ message: "Tag cannot be empty string" })
      .optional(),
    sizes: z
      .array(z.object({ size: z.string(), price: z.number() }))
      .optional(),
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
export type UpdateProductInput = z.TypeOf<typeof updateProductSchema>;

// creating a new extra schema
export const newExtraSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name field is required" })
      .nonempty({ message: "Name cannot be empty string" }),
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

// updating extra schema
export const updateExtraSchema = z.object({
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
      .string({ required_error: "Name field is required" })
      .nonempty({ message: "Name cannot be empty string" })
      .optional(),
    paid: z.boolean().optional(),
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
export type UpdateExtraInput = z.TypeOf<typeof updateExtraSchema>;

// creating a new extraItem schema
export const newExtraItemSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "ExtraItem name is required" }),
    price: z.number().min(0).optional(),
    allergens: z
      .string()
      .nonempty({ message: "Allergens cannot be empty string" })
      .transform((allergens, ctx) => {
        const allergensArray = allergens.split(",");
        if (!allergensArray) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "allergens should be seperated by a comma",
          });

          return z.NEVER;
        }
        return allergensArray;
      })
      .optional(),
  }),
});
export type NewExtraItemInput = z.TypeOf<typeof newExtraItemSchema>["body"];

// updating Item schema
export const updateExtraItemSchema = z.object({
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
      .string({ required_error: "Extra Item name is required" })
      .nonempty({ message: "Extra Item name cannot be empty string" })
      .optional(),
    price: z.number().min(0).optional(),
    allergens: z
      .string()
      .nonempty({ message: "Allergens cannot be empty string" })
      .transform((allergens, ctx) => {
        const allergensArray = allergens.split(",");
        if (!allergensArray) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "allergens should be seperated by a comma",
          });

          return z.NEVER;
        }
        return allergensArray;
      })
      .optional(),
  }),
});
export type UpdateExtraItemInput = z.TypeOf<typeof updateExtraItemSchema>;
