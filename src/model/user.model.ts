import { prop, pre, index, Ref } from "@typegoose/typegoose";
import { Severity } from "@typegoose/typegoose/lib/internal/constants";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import { v4 as uuidv4 } from "uuid";
import { DocumentType } from "@typegoose/typegoose/lib/types";
import bcrypt from "bcrypt";

import { Order } from "./order.model";

export class Address {
  @prop({ required: true })
  street!: string;

  @prop({ required: true })
  city!: string;

  @prop({ required: true })
  houseNumber!: string;

  @prop({ required: true })
  postalCode!: string;
}

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;
  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // because we are expecting password
    // reset code to be string or null
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;
  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;
  @prop({ required: true, default: () => uuidv4() })
  verificationCode: string;

  @prop({ default: false })
  isAdmin: boolean;

  // Addresses
  @prop({ type: () => Address, _id: false })
  homeAddress?: Address;
  @prop({ type: () => Address, _id: false })
  workAddress?: Address;
  @prop({ type: () => Address, _id: false })
  otherAddress?: Address;

  // All Orders and Favourite Orders
  @prop({ ref: () => Order })
  orders?: Ref<Order>[];
  @prop({ ref: () => Order })
  favouriteOrders?: Ref<Order>[];

  async validatePassword(this: DocumentType<User>, enteredPassword: string) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
