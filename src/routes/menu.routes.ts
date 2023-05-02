import express from "express";
import asyncHandler from "express-async-handler";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

import {
  findAllCategoriesHandler,
  findAllExtraItemsHandler,
  findAllExtrasHandler,
  findAllProductsHandler,
  findCategoryByIdHandler,
  findExtraByIdHandler,
  findExtraItemByIdHandler,
  findProductByIdHandler,
  newCategoryHandler,
  newExtraHandler,
  newExtraItemHandler,
  newProductHandler,
} from "../controller/menu.controller";
import {
  newCategorySchema,
  newExtraItemSchema,
  newExtraSchema,
  newProductSchema,
} from "../schema/menu.schema";
import { byIdSchema } from "../schema/global.schema";

const router = express.Router();

// GET

router.get("/api/menu/category", asyncHandler(findAllCategoriesHandler));
router.get("/api/menu/product", asyncHandler(findAllProductsHandler));
router.get("/api/menu/extra", asyncHandler(findAllExtrasHandler));
router.get("/api/menu/extraItem", asyncHandler(findAllExtraItemsHandler));

router.get(
  "/api/menu/category/:id",
  validateSchema(byIdSchema),
  asyncHandler(findCategoryByIdHandler)
);
router.get(
  "/api/menu/product/:id",
  validateSchema(byIdSchema),
  asyncHandler(findProductByIdHandler)
);
router.get(
  "/api/menu/extra/:id",
  validateSchema(byIdSchema),
  asyncHandler(findExtraByIdHandler)
);
router.get(
  "/api/menu/extraItem/:id",
  validateSchema(byIdSchema),
  asyncHandler(findExtraItemByIdHandler)
);

// POST
router.post(
  "/api/menu/category",
  validateSchema(newCategorySchema),
  asyncHandler(newCategoryHandler)
);
router.post(
  "/api/menu/product",
  validateSchema(newProductSchema),
  asyncHandler(newProductHandler)
);
router.post(
  "/api/menu/extra",
  validateSchema(newExtraSchema),
  asyncHandler(newExtraHandler)
);
router.post(
  "/api/menu/extraItem",
  validateSchema(newExtraItemSchema),
  asyncHandler(newExtraItemHandler)
);

export default router;
