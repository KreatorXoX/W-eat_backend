import { prop, modelOptions, Severity, Ref } from "@typegoose/typegoose";
import { ExtraItem } from "./extraItem.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Extra {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: Boolean })
  paid: boolean;

  @prop({ ref: () => ExtraItem })
  extraItems?: Ref<ExtraItem>[];
}
