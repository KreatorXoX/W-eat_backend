import {
  prop,
  modelOptions,
  Severity,
  Ref,
  pre,
  post,
} from "@typegoose/typegoose";

import { Category } from "./category.model";
import { CategoryModel } from ".";

export class Size {
  @prop({ type: String, required: true })
  size!: string;

  @prop({ type: Number, required: true })
  price!: number;
}

@pre<Product>("save", async function () {
  if (this.isModified("category")) {
    try {
      const category = await CategoryModel.findById(this.category);
      if (!category?.products?.includes(this._id)) {
        category?.products?.push(this._id);
        await category?.save();
      }
    } catch (error) {
      console.log("error in @pre save product");
    }
  }
})
@post<Product>("findOneAndRemove", async function (product) {
  try {
    await CategoryModel.findByIdAndUpdate(
      { _id: product.category },
      { $pull: { products: product._id } }
    );
  } catch (error) {
    console.log("error in @post remove product");
  }
})
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Product {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: String, required: true })
  description: string;

  @prop({ type: () => Size, _id: false, required: true })
  sizes: Size[];

  @prop({ type: String, required: true })
  ingridients: string;

  @prop({
    get: (allergen: string[] | undefined) => allergen?.join(","),
    set: (allergen: string | undefined) =>
      typeof allergen === "string" ? allergen.split(",") : undefined,
    type: String,
    required: false,
  })
  allergens?: string[];

  @prop({ type: String })
  tag?: string | null;

  @prop({ ref: () => Category })
  category?: Ref<Category>;
}
