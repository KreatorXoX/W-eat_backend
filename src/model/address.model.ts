import { prop } from "@typegoose/typegoose";

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
