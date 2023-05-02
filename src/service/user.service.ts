import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";

import { User } from "../model/user.model";
import { UserModel } from "../model";
// for client

export function findAllUsers() {
  return UserModel.find().select("_id firstName lastName").lean().exec();
}
export function findUserByIdForClient(id: mongoose.Types.ObjectId) {
  return UserModel.findById(id).select("_id firstName lastName").lean().exec();
}

// for server

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id).exec();
}

export function findUserByMail(email: string) {
  return UserModel.findOne({ email: email }).exec();
}

export function findAndUpdateUser(
  query: FilterQuery<DocumentType<User>>,
  update: UpdateQuery<DocumentType<User>>,
  options: QueryOptions = {}
) {
  return UserModel.findOneAndUpdate(query, update, options);
}
