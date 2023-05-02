import { prop, modelOptions, Severity } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class ExtraItem {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: Number, min: 0, default: 0 })
  price: number;

  @prop({
    get: (allergen: string[] | undefined) => allergen?.join(","),
    set: (allergen: string | undefined) =>
      typeof allergen === "string" ? allergen.split(",") : undefined,
    type: String,
    required: false,
  })
  allergens?: string[];
}
