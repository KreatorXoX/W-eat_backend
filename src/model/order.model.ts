import { prop, modelOptions, Severity, Ref } from "@typegoose/typegoose";

import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Order {
  @prop({ required: true })
  orderItems: string;
  @prop({ ref: () => User })
  user?: Ref<User>;
}
