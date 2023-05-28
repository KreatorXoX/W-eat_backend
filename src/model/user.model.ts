import { prop, pre, index, Ref } from "@typegoose/typegoose";
import { Severity } from "@typegoose/typegoose/lib/internal/constants";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import { v4 as uuidv4 } from "uuid";
import { DocumentType } from "@typegoose/typegoose/lib/types";
import bcrypt from "bcrypt";

import { Order } from "./order.model";

export class Address {
  @prop({ type: String, required: true })
  street!: string;

  @prop({ type: String, required: true })
  city!: string;

  @prop({ type: String, required: true })
  houseNumber!: string;

  @prop({ type: String, required: true })
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
  @prop({
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  })
  email: string;

  @prop({ type: String, required: true })
  firstName: string;
  @prop({ type: String, required: true })
  lastName: string;

  @prop({ type: String, required: true })
  password: string;
  @prop()
  passwordResetCode: string | null;

  @prop({ type: Boolean, default: false })
  verified: boolean;
  @prop({ type: String, required: true, default: () => uuidv4() })
  verificationCode: string;

  @prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @prop({ type: Boolean, default: false })
  isSuspended: boolean;

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
