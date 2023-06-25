import express from "express";
import asyncHandler from "express-async-handler";
import validateSchema from "../middleware/validateSchema";
import {
  findRestaurantHandler,
  getRestaurantRevenueHandler,
  newRestaurantHandler,
  updateRestaurantHandler,
} from "../controller/restaurant.controller";
import {
  deleteRestaurantSchema,
  newRestaurantSchema,
  updateRestaurantSchema,
} from "../schema/restaurant.schema";

const router = express.Router();

router.get("/api/restaurant", asyncHandler(findRestaurantHandler));
router.get("/api/revenue", asyncHandler(getRestaurantRevenueHandler));

router.post(
  "/api/restaurant",
  validateSchema(newRestaurantSchema),
  asyncHandler(newRestaurantHandler)
);

router.patch(
  "/api/restaurant/:id",
  validateSchema(updateRestaurantSchema),
  asyncHandler(updateRestaurantHandler)
);

router.delete(
  "/api/restaurant/:id",
  validateSchema(deleteRestaurantSchema),
  asyncHandler(updateRestaurantHandler)
);

export default router;
