import express from "express";
import asyncHandler from "express-async-handler";

import {
  deleteUserHandler,
  findAllUsersHandler,
  findOrdersByUserHandler,
  findUserByIdForClientHandler,
  updateUserHandler,
  updateUserStatusHandler,
} from "../controller/user.controller";

import { findUserByIdSchema, updateUserSchema } from "../schema/user.schema";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";
import { byIdSchema } from "../schema/global.schema";

const router = express.Router();

router.get("/api/users", asyncHandler(findAllUsersHandler));

router.get(
  "/api/user/:id",
  validateSchema(findUserByIdSchema),
  asyncHandler(findUserByIdForClientHandler)
);

router.get(
  "/api/user/orders/:id",
  validateSchema(findUserByIdSchema),
  asyncHandler(findOrdersByUserHandler)
);

// PATCH
router.patch(
  "/api/user/suspend/:id",
  validateSchema(byIdSchema),
  asyncHandler(updateUserStatusHandler)
);

router.patch(
  "/api/user/:id",
  validateSchema(updateUserSchema),
  asyncHandler(updateUserHandler)
);

// DELETE
router.delete(
  "/api/user/:id",
  validateSchema(byIdSchema),
  asyncHandler(deleteUserHandler)
);

export default router;
