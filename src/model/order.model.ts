import {
  prop,
  modelOptions,
  Severity,
  Ref,
  pre,
  post,
} from "@typegoose/typegoose";

import { User } from "./user.model";
import { Product } from "./product.model";
import { ExtraItem } from "./extraItem.model";

import { ProductModel, ExtraItemModel, UserModel, OrderModel } from ".";

export enum Status {
  PENDING = "pending",
  ACCEPTED = "accepted",
  CANCELED = "canceled",
  DELIVERED = "delivered",
  SHIPPED = "shipped",
}

export enum PaymentStatus {
  SUCCESS = "successful",
  PENDING = "pending",
}
export enum PaymentMethod {
  CARD = "card",
  PAD = "pay at door",
}

class OrderItem {
  @prop({ ref: () => Product, required: true })
  product: Ref<Product>;

  @prop({ ref: () => ExtraItem })
  extras?: Ref<ExtraItem>[];

  @prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @prop({ type: String, required: true })
  size: string;

  @prop({ type: String })
  note?: string;
}

@pre<Order>("save", async function () {
  if (this.isModified("orderItems")) {
    let calculatedTotalPrice = 0;
    for (let orderItem of this.orderItems) {
      const product = await ProductModel.findById(orderItem.product._id).exec();
      const extras = await ExtraItemModel.find({
        _id: { $in: orderItem.extras },
      }).exec();

      for (let extra of extras) {
        calculatedTotalPrice += extra.price;
      }

      const productPrice = product?.sizes.find(
        (size) => size.size === orderItem.size
      );

      calculatedTotalPrice =
        (calculatedTotalPrice + (productPrice ? productPrice?.price! : 0)) *
        orderItem.quantity;
    }

    this.totalPrice = calculatedTotalPrice;
    this.deliveryCost = 5;
  }

  if (this.isModified("user")) {
    const user = await UserModel.findById(this.user._id).exec();
    if (user) {
      user.orders?.push(this._id);
      await user.save();
    }
  }
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Order {
  @prop({ type: () => OrderItem, _id: false, required: true })
  orderItems: OrderItem[];

  @prop({ ref: () => User, required: true })
  user: Ref<User>;

  @prop({ type: String, required: true })
  fullName: string;

  @prop({ type: String, required: true })
  email: string;

  @prop({ type: String, required: true })
  phoneNumber: string;

  @prop({ type: Number, min: 0 })
  deliveryCost?: number;

  @prop({ type: Number, min: 0 })
  totalPrice?: number;

  @prop({ enum: Status, default: Status.PENDING })
  status: Status;

  @prop({ type: String, required: true })
  address: string;

  @prop({ type: String, required: true })
  placeOrderTime: string;

  @prop({ type: Boolean, default: false })
  isFavourite: boolean;

  // figure out what should we store in the order model
  // in accordance with the stripe api return
  @prop({ enum: PaymentMethod, required: true })
  paymentMethod: string;

  @prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;
  // figure out what should we store in the order model
  // in accordance with the stripe api return
}
