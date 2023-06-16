import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { OrderModel } from "../model";
import { Order } from "../model/order.model";

export function findOrders() {
  return OrderModel.find().populate("orderItems");
}

export function findPaginatedOrders(limit: number, skip: number) {
  return OrderModel.find()
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: "orderItems",
      populate: "product extras",
      select: "product extras quantity size note",
    })
    .exec();
}

export function findOrderById(id: mongoose.Types.ObjectId) {
  return OrderModel.findById(id)
    .populate({
      path: "orderItems",
      populate: "product extras",
      select: "product extras quantity size note",
    })
    .exec();
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

export function deleteOrder(id: mongoose.Types.ObjectId) {
  return OrderModel.findByIdAndDelete(id).exec();
}
