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
import mongoose from "mongoose";

// Categories
export function findAllCategories() {
  return CategoryModel.find().lean().exec();
}
export function findCategoryById(id: mongoose.Types.ObjectId) {
  return CategoryModel.findById(id).lean().exec();
}

export function createCategory(input: Partial<Category>) {
  return CategoryModel.create(input);
}

// Products
export function findAllProducts() {
  return ProductModel.find().lean().exec();
}
export function findProductById(id: mongoose.Types.ObjectId) {
  return ProductModel.findById(id).lean().exec();
}

export function createProduct(input: Partial<Product>) {
  return ProductModel.create(input);
}

// Extras
export function findAllExtras() {
  return ExtraModel.find().lean().exec();
}
export function findExtraById(id: mongoose.Types.ObjectId) {
  return ExtraModel.findById(id).lean().exec();
}

export function createExtra(input: Partial<Extra>) {
  return ExtraModel.create(input);
}

// Extra Items
export function findAllExtraItems() {
  return ExtraItemModel.find().lean().exec();
}
export function findExtraItemById(id: mongoose.Types.ObjectId) {
  return ExtraItemModel.findById(id).lean().exec();
}

export function createExtraItem(input: Partial<ExtraItem>) {
  return ExtraItemModel.create(input);
}
