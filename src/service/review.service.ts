import mongoose from "mongoose";
import { ReviewModel } from "../model";
import { Review } from "../model/review.model";

// Reviews
export function findAllReviews() {
  return ReviewModel.find();
}

export function findReviewById(id: mongoose.Types.ObjectId) {
  return ReviewModel.findById(id).exec();
}

export function createReview(input: Partial<Review>) {
  return ReviewModel.create(input);
}
