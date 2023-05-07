import express from "express";
import asyncHandler from "express-async-handler";

import {
  findAllUsersHandler,
  findUserByIdForClientHandler,
} from "../controller/user.controller";

import { findUserByIdSchema } from "../schema/user.schema";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";
import { newOrderHandler } from "../controller/order.controller";

const router = express.Router();

router.post("/api/orders", asyncHandler(newOrderHandler));

// router.get();

export default router;
