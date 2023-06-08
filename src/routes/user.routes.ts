import express from "express";
import asyncHandler from "express-async-handler";

import {
  findAllUsersHandler,
  findUserByIdForClientHandler,
  updateUserHandler,
} from "../controller/user.controller";

import { findUserByIdSchema, updateUserSchema } from "../schema/user.schema";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.get("/api/users", verifyAdmin, asyncHandler(findAllUsersHandler));

router.get(
  "/api/user/:id",
  validateSchema(findUserByIdSchema),
  asyncHandler(findUserByIdForClientHandler)
);

// PATCH
router.patch(
  "/api/user/:id",
  validateSchema(updateUserSchema),
  asyncHandler(updateUserHandler)
);
export default router;
