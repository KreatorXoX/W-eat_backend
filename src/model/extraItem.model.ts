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
  @prop({ required: true })
  name: string;

  @prop({ type: () => Number, min: 0, default: 0 })
  price: number;

  @prop({
    set: (alergen: string[]) => alergen.join(","),
    get: (alergen: string) => alergen.split(","),
    type: String,
  })
  alergens?: string[] | null;
}
