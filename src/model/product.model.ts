import { prop, modelOptions, Severity, Ref } from "@typegoose/typegoose";

import { Category } from "./category.model";

export class Size {
  @prop({ required: true })
  size!: string;

  @prop({ required: true })
  price!: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Product {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ type: () => Size, _id: false })
  sizes: Size[];

  @prop({ required: true })
  ingridients: string;

  @prop({
    set: (alergen: string[]) => alergen.join(","),
    get: (alergen: string) => alergen.split(","),
    type: String,
  })
  alergens?: string[] | null;

  @prop()
  tag: string | null;

  @prop({ ref: () => Category })
  category?: Ref<Category>;
}
