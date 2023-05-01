import { prop, modelOptions, Severity, Ref, pre } from "@typegoose/typegoose";

import { User } from "./user.model";
import { Product } from "./product.model";
import { ExtraItem } from "./extraItem.model";

import { ProductModel, ExtraItemModel } from ".";

enum Status {
  PENDING = "pending",
  CONFIRMED = "comfirmed",
  CANCELED = "canceled",
  DELIVERED = "delivered",
  SHIPPED = "shipped",
}

class OrderItem {
  @prop({ ref: () => Product })
  product: Ref<Product>;

  @prop({ ref: () => ExtraItem })
  extras: Ref<ExtraItem>[];

  @prop({ type: () => Number, required: true })
  quantity: number;

  @prop({ type: () => String })
  size: string;

  @prop({ type: () => String })
  note: string;
}

@pre<Order>("save", async function () {
  if (this.isModified("status")) {
    this.status = this.status;
    return;
  }

  if (this.isModified("orderItems")) {
    let calculatedTotalPrice = 0;

    for (let orderItem of this.orderItems) {
      const product = await ProductModel.findById(orderItem.product._id).exec();
      const extras = await ExtraItemModel.find({
        _id: { $in: orderItem.extras },
      });

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
    return;
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
  @prop({ type: () => OrderItem, _id: false })
  orderItems: OrderItem[];

  @prop({ ref: () => User, required: true })
  user: Ref<User>;

  @prop({ type: () => Number, min: 0 })
  deliveryCost: number;

  @prop({ type: () => Number, min: 0 })
  totalPrice: number;

  @prop({ required: true, enum: Status, default: Status.PENDING })
  status?: Status;

  @prop({ required: true })
  address: string;

  @prop({ required: true, default: false })
  isFavourite: boolean;

  // figure out what should we store in the order model
  // in accordance with the stripe api return
  @prop({ required: true })
  paymentMethod: string;

  @prop()
  paymentId: string;

  @prop()
  paymentStatus: string;

  // figure out what should we store in the order model
  // in accordance with the stripe api return
}
