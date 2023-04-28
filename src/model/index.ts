import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./user.model";
import { Order } from "./order.model";

export const UserModel = getModelForClass(User);
export const OrderModel = getModelForClass(Order);
