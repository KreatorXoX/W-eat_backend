import { prop, modelOptions, Severity, Ref } from "@typegoose/typegoose";
import { ExtraItem } from "./extraItem.model";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Review {
  @prop({ ref: () => User })
  user?: Ref<User>;

  @prop({ required: true })
  content: string;

  @prop({ type: () => Number, min: 0, max: 5, required: true })
  rating: number;

  @prop({ type: () => String })
  response?: string;
}
