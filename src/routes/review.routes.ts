import express from "express";
import asyncHandler from "express-async-handler";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";
import {
  newResponseHandler,
  findAllReviewsHandler,
  newReviewHandler,
} from "../controller/review.controller";
import { newResponseSchema, newReviewSchema } from "../schema/review.schema";

const router = express.Router();

router.get("/api/reviews", asyncHandler(findAllReviewsHandler));

router.post(
  "/api/reviews",
  validateSchema(newReviewSchema),
  asyncHandler(newReviewHandler)
);

router.post(
  "/api/reviews/:id/response",
  validateSchema(newResponseSchema),
  asyncHandler(newResponseHandler)
);

export default router;
