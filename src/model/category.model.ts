import { prop, modelOptions, Severity, Ref } from "@typegoose/typegoose";

import { Product } from "./product.model";
import { Extra } from "./extra.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Category {
  @prop({ required: true })
  name: string;

  @prop({ ref: () => Product })
  products?: Ref<Product>[] | null;

  @prop({ ref: () => Extra })
  extras?: Ref<Extra>[] | null;
}
