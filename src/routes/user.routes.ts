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

const router = express.Router();

router.get("/api/users", verifyAdmin, asyncHandler(findAllUsersHandler));

router.get(
  "/api/user/:id",
  verifyJWT,
  validateSchema(findUserByIdSchema),
  asyncHandler(findUserByIdForClientHandler)
);

export default router;
