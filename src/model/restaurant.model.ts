import {
  prop,
  modelOptions,
  Severity,
  Ref,
  DocumentType,
  isDocument,
} from "@typegoose/typegoose";
import { Review } from "./review.model";
import { findOrders } from "../service/order.service";

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Restaurant {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: String, required: true })
  address: string;

  @prop({ type: String, trim: true, lowercase: true })
  email?: string;

  @prop({ type: String })
  phoneNumber?: string;

  @prop({ type: String, default: "some url" })
  backgroundImage?: string;

  @prop({ type: Number, required: true })
  minDeliveryAmount: number;

  @prop({ type: String, required: true })
  averageDeliveryTime: string;

  @prop({ type: Number, required: true })
  deliveryCost: number;

  @prop({ required: true })
  operationTime: {
    openingTime: string;
    closingTime: string;
  };

  @prop({ ref: () => Review })
  reviews?: Ref<Review>[];

  async calculateRating(this: DocumentType<Restaurant>) {
    try {
      const restaurant = await this.populate({
        path: "reviews",
        select: "rating",
      });
      const totalReviews = restaurant.reviews?.length;

      if (!totalReviews) {
        return 0;
      }
      let totalRating = 0;
      for (let review of restaurant.reviews!) {
        if (isDocument(review)) {
          totalRating += review.rating;
        }
      }

      return totalRating / totalReviews!;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async getRevenue() {
    try {
      const orders = await findOrders();

      const total = orders.reduce((prev, current) => {
        if (current.status === "delivered") {
          return prev + (current.totalPrice || 0);
        }
        return prev;
      }, 0);
      console.log(orders);
      const reveue = {
        totalOrders: orders.length,
        totalEarned: total,
        ordersCompleted: orders.filter((order) => order.status === "delivered")
          .length,
        ordersActive: orders.filter((order) => order.status === "accepted")
          .length,
        ordersCanceled: orders.filter((order) => order.status === "canceled")
          .length,
        ordersPending: orders.filter((order) => order.status === "pending")
          .length,
      };

      return reveue;
    } catch (error) {
      console.log("revenue calc error");
      return 0;
    }
  }
}
