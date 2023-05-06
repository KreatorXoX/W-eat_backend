import express from "express";
import asyncHandler from "express-async-handler";

import validateSchema from "../middleware/validateSchema";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

import {
  deleteCategoryHandler,
  deleteExtraHandler,
  deleteExtraItemHandler,
  deleteProductHandler,
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
  updateCategoryHandler,
  updateExtraHandler,
  updateExtraItemHandler,
  updateProductHandler,
} from "../controller/menu.controller";
import {
  newCategorySchema,
  newExtraItemSchema,
  newExtraSchema,
  newProductSchema,
  updateCategorySchema,
  updateExtraSchema,
  updateProductSchema,
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

// PATCH
router.patch(
  "/api/menu/category/:id",
  validateSchema(updateCategorySchema),
  asyncHandler(updateCategoryHandler)
);
router.patch(
  "/api/menu/product/:id",
  validateSchema(updateProductSchema),
  asyncHandler(updateProductHandler)
);
router.patch(
  "/api/menu/extra/:id",
  validateSchema(updateExtraSchema),
  asyncHandler(updateExtraHandler)
);
router.patch(
  "/api/menu/extraItem/:id",
  validateSchema(byIdSchema),
  asyncHandler(updateExtraItemHandler)
);

// DELETE
router.delete(
  "/api/menu/category/:id",
  validateSchema(byIdSchema),
  asyncHandler(deleteCategoryHandler)
);
router.delete(
  "/api/menu/product/:id",
  validateSchema(byIdSchema),
  asyncHandler(deleteProductHandler)
);
router.delete(
  "/api/menu/extra/:id",
  validateSchema(byIdSchema),
  asyncHandler(deleteExtraHandler)
);
router.delete(
  "/api/menu/extraItem/:id",
  validateSchema(byIdSchema),
  asyncHandler(deleteExtraItemHandler)
);
export default router;
