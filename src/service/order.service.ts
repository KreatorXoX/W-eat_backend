import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { OrderModel } from "../model";
import { Order } from "../model/order.model";

export function findOrders() {
  return OrderModel.find();
}

export function findOrderById(id: mongoose.Types.ObjectId) {
  return OrderModel.findById(id).exec();
}

export function createOrder(input: Partial<Order>) {
  return OrderModel.create(input);
}
export function updateOrder(
  query: FilterQuery<DocumentType<Order>>,
  update: UpdateQuery<DocumentType<Order>>,
  options: QueryOptions = {}
) {
  return OrderModel.findOneAndUpdate(query, update, options).exec();
}
