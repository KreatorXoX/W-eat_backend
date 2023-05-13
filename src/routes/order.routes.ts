import express from "express";
import asyncHandler from "express-async-handler";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";
import {
  findOrderByIdHandler,
  findOrdersHandler,
  newOrderHandler,
  newStripeOrderHandler,
  updateOrderHandler,
} from "../controller/order.controller";
import { newOrderSchema, updateOrderSchema } from "../schema/order.schema";
import { byIdSchema } from "../schema/global.schema";

const router = express.Router();

router.get("/api/orders", asyncHandler(findOrdersHandler));
router.get(
  "/api/orders/:id",
  validateSchema(byIdSchema),
  asyncHandler(findOrderByIdHandler)
);
router.post(
  "/api/orders",
  // validateSchema(newOrderSchema),
  asyncHandler(newOrderHandler)
);
router.post(
  "/api/orders/checkout",
  // validateSchema(newOrderSchema),
  asyncHandler(newStripeOrderHandler)
);

router.patch(
  "/api/orders/:id",
  validateSchema(updateOrderSchema),
  asyncHandler(updateOrderHandler)
);

export default router;
