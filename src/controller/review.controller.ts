import { Response, Request, NextFunction } from "express";

import HttpError from "../model/http-error";

import { findAllUsers, findUserByIdForClient } from "../service/user.service";

import { FindUserByIdInput } from "../schema/user.schema";
import { NewResponseInput, NewReviewInput } from "../schema/review.schema";
import {
  createReview,
  findAllReviews,
  findReviewById,
} from "../service/review.service";

export async function newReviewHandler(
  req: Request<{}, {}, NewReviewInput>,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
  const review = await createReview(body);

  if (!review) {
    return next(new HttpError("No review is available", 404));
  }

  res.json(review);
}

export async function findAllReviewsHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const reviews = await findAllReviews();

  if (!reviews || reviews?.length < 1) {
    return next(new HttpError("No review is available", 404));
  }

  res.json(reviews);
}

export async function newResponseHandler(
  req: Request<NewResponseInput["params"], {}, NewResponseInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { content } = req.body;

  const review = await findReviewById(id!);

  if (!review) {
    return next(new HttpError("Review not found", 404));
  }

  review.response = content;
  await review.save();

  res.json(review);
}
