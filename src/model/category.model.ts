import {
  prop,
  modelOptions,
  Severity,
  Ref,
  pre,
  post,
} from "@typegoose/typegoose";

import { Product } from "./product.model";
import { Extra } from "./extra.model";
import { ProductModel } from ".";

@post<Category>("findOneAndRemove", async function (category) {
  try {
    const updated = await ProductModel.updateMany(
      { _id: { $in: category.products } },
      { category: null }
    );
  } catch (error) {
    console.log("error in @post remove product");
  }
})
@pre<Category>("save", async function () {
  if (this.isModified("products")) {
    try {
      const products = await ProductModel.find({ _id: { $in: this.products } });
      for (let product of products) {
        if (product.category !== this._id) {
          product.category = this._id;
          await product.save();
        }
      }
    } catch (error) {
      console.log("error in @pre save Category");
    }
  }
})
export class Category {
  @prop({ type: String, unique: true, required: true })
  name: string;

  @prop({ ref: () => Product })
  products?: Ref<Product>[];

  @prop({ ref: () => Extra })
  extras?: Ref<Extra>[];
}
