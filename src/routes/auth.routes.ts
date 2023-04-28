import express from "express";
import asyncHandler from "express-async-handler";

import {
  googleOAuthHandler,
  loginUserHandler,
  logoutUserHandler,
  refreshUserHandler,
  registerUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controller/auth.controller";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
  loginUserSchema,
  registerUserSchema,
} from "../schema/auth.schema";

import loginLimiter from "../middleware/loginLimiter";
import validateSchema from "../middleware/validateSchema";

const router = express.Router();

router.post(
  "/api/auth/register",
  validateSchema(registerUserSchema),
  asyncHandler(registerUserHandler)
);

router.post(
  "/api/auth/login",
  loginLimiter,
  validateSchema(loginUserSchema),
  asyncHandler(loginUserHandler)
);

router.post("/api/auth/logout", asyncHandler(logoutUserHandler));

router.get("/api/auth/refresh", asyncHandler(refreshUserHandler));

router.get("/api/oauth/google", googleOAuthHandler);

router.get(
  "/api/auth/verify/:id/:verificationCode",
  validateSchema(verifyUserSchema),
  asyncHandler(verifyUserHandler)
);
router.post(
  "/api/auth/forgot-password",
  validateSchema(forgotPasswordSchema),
  asyncHandler(forgotPasswordHandler)
);
router.post(
  "/api/auth/reset-password/:id/:passwordResetCode",
  validateSchema(resetPasswordSchema),
  asyncHandler(resetPasswordHandler)
);
export default router;
