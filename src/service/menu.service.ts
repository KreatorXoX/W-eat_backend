import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { Category } from "../model/category.model";
import {
  CategoryModel,
  ExtraItemModel,
  ExtraModel,
  ProductModel,
} from "../model";
import { Product } from "../model/product.model";
import { Extra } from "../model/extra.model";
import { ExtraItem } from "../model/extraItem.model";

// Categories
export function findAllCategories() {
  return CategoryModel.find().lean();
}

export function findCategoryById(id: mongoose.Types.ObjectId) {
  return CategoryModel.findById(id).lean().exec();
}

export function createCategory(input: Partial<Category>) {
  return CategoryModel.create(input);
}

export function updateCategory(
  query: FilterQuery<DocumentType<Category>>,
  update: UpdateQuery<DocumentType<Category>>,
  options: QueryOptions = {}
) {
  return CategoryModel.findOneAndUpdate(query, update, options).exec();
}

export function deleteCategory(id: mongoose.Types.ObjectId) {
  return CategoryModel.findByIdAndDelete(id).exec();
}

// Products
export function findAllProducts() {
  return ProductModel.find().lean();
}

export function findProductById(id: mongoose.Types.ObjectId) {
  return ProductModel.findById(id).lean().exec();
}

export function createProduct(input: Partial<Product>) {
  return ProductModel.create(input);
}

export function updateProduct(
  query: FilterQuery<DocumentType<Product>>,
  update: UpdateQuery<DocumentType<Product>>,
  options: QueryOptions = {}
) {
  return ProductModel.findOneAndUpdate(query, update, options).exec();
}

export function deleteProduct(id: mongoose.Types.ObjectId) {
  return ProductModel.findByIdAndRemove(id).exec();
}

// Extras
export function findAllExtras() {
  return ExtraModel.find().lean();
}

export function findExtraById(id: mongoose.Types.ObjectId) {
  return ExtraModel.findById(id).lean().exec();
}

export function createExtra(input: Partial<Extra>) {
  return ExtraModel.create(input);
}

export function updateExtra(
  query: FilterQuery<DocumentType<Extra>>,
  update: UpdateQuery<DocumentType<Extra>>,
  options: QueryOptions = {}
) {
  return ExtraModel.findOneAndUpdate(query, update, options).exec();
}

export function deleteExtra(id: mongoose.Types.ObjectId) {
  return ExtraModel.findByIdAndDelete(id).exec();
}

// Extra Items
export function findAllExtraItems() {
  return ExtraItemModel.find().lean();
}

export function findExtraItemById(id: mongoose.Types.ObjectId) {
  return ExtraItemModel.findById(id).lean().exec();
}

export function createExtraItem(input: Partial<ExtraItem>) {
  return ExtraItemModel.create(input);
}

export function updateExtraItem(
  query: FilterQuery<DocumentType<ExtraItem>>,
  update: UpdateQuery<DocumentType<ExtraItem>>,
  options: QueryOptions = {}
) {
  return ExtraItemModel.findOneAndUpdate(query, update, options).exec();
}

export function deleteExtraItem(id: mongoose.Types.ObjectId) {
  return ExtraItemModel.findByIdAndDelete(id).exec();
}
