import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./user.model";
import { Order } from "./order.model";
import { Product } from "./product.model";
import { Category } from "./category.model";
import { Extra } from "./extra.model";
import { ExtraItem } from "./extraItem.model";
import { Restaurant } from "./restaurant.model";
import { Review } from "./review.model";

export const UserModel = getModelForClass(User);
export const OrderModel = getModelForClass(Order);
export const CategoryModel = getModelForClass(Category);
export const ProductModel = getModelForClass(Product);
export const ExtraModel = getModelForClass(Extra);
export const ExtraItemModel = getModelForClass(ExtraItem);
export const RestaurantModel = getModelForClass(Restaurant);
export const ReviewModel = getModelForClass(Review);
