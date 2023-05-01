import {
  prop,
  modelOptions,
  Severity,
  Ref,
  DocumentType,
  isDocument,
} from "@typegoose/typegoose";
import { Review } from "./review.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Restaurant {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;

  @prop({ type: () => String })
  email?: string;

  @prop({ type: () => String, default: "some url" })
  backgroundImage?: string;

  @prop({ required: true })
  minDeliveryAmount: number;

  @prop({ required: true })
  averageDeliveryTime: number;

  @prop({ required: true })
  deliveryCost: number;

  @prop({ required: true })
  operationTime: {
    openingTime: string;
    closingTime: string;
  };

  @prop({ ref: () => Review })
  reviews: Ref<Review>[];

  async calculateRating(this: DocumentType<Restaurant>) {
    try {
      const restaurant = await this.populate({
        path: "reviews",
        select: "rating",
      });
      const totalReviews = restaurant.reviews.length;
      let totalRating = 0;
      for (let review of restaurant.reviews) {
        if (isDocument(review)) {
          totalRating += review.rating;
        }
      }

      return totalRating / totalReviews;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
