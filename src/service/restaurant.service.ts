import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { RestaurantModel } from "../model";
import { Restaurant } from "../model/restaurant.model";

// Restaurant
export function findRestaurant() {
  return RestaurantModel.find();
}

export function createRestaurant(input: Partial<Restaurant>) {
  return RestaurantModel.create(input);
}

export function updateRestaurant(
  query: FilterQuery<DocumentType<Restaurant>>,
  update: UpdateQuery<DocumentType<Restaurant>>,
  options: QueryOptions = {}
) {
  return RestaurantModel.findOneAndUpdate(query, update, options);
}

export function deleteRestaurant(id: mongoose.Types.ObjectId) {
  return RestaurantModel.findByIdAndDelete(id);
}
