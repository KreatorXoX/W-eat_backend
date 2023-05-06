import { Response, Request, NextFunction } from "express";

import HttpError from "../model/http-error";

import {
  findAllCategories,
  findCategoryById,
  createCategory,
  findAllProducts,
  findProductById,
  createProduct,
  findAllExtras,
  findExtraById,
  createExtra,
  createExtraItem,
  findExtraItemById,
  findAllExtraItems,
  updateCategory,
  deleteCategory,
  updateProduct,
  deleteProduct,
  updateExtra,
  deleteExtra,
  updateExtraItem,
  deleteExtraItem,
} from "../service/menu.service";

import { ByIdInput } from "../schema/global.schema";
import {
  NewCategoryInput,
  NewExtraInput,
  NewExtraItemInput,
  NewProductInput,
  UpdateCategoryInput,
  UpdateExtraInput,
  UpdateExtraItemInput,
  UpdateProductInput,
} from "../schema/menu.schema";
import { findRestaurant } from "../service/restaurant.service";

// Menu
export async function getMenu(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const categories = await findAllCategories();

  if (!categories || categories?.length < 1) {
    return next(new HttpError("No category is found", 404));
  }

  const restaurant = await findRestaurant();
  if (!restaurant || restaurant?.length < 1) {
    return next(new HttpError("No restaurant is found", 404));
  }
  const restaurantRating = await restaurant[0].calculateRating();

  res.json({
    categories: categories,
    restaurant: restaurant[0],
    rating: restaurantRating,
  });
}

// Categories
export async function findAllCategoriesHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const categories = await findAllCategories();

  if (!categories || categories?.length < 1) {
    return next(new HttpError("No category is found", 404));
  }

  res.json(categories);
}

export async function findCategoryByIdHandler(
  req: Request<ByIdInput>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const category = await findCategoryById(id!);

  if (!category) {
    return next(new HttpError("Category not found", 404));
  }

  res.json(category);
}

export async function newCategoryHandler(
  req: Request<{}, {}, NewCategoryInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Error creating new category";
  const body = req.body;
  const category = await createCategory(body);

  if (!category) {
    return next(new HttpError(message, 404));
  }

  res.json(category);
}

export async function updateCategoryHandler(
  req: Request<UpdateCategoryInput["params"], {}, UpdateCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating Category";
  const body = req.body;
  const { id } = req.params;

  const category = await updateCategory(
    { _id: id },
    {
      ...body,
    }
  );

  if (!category) {
    return next(new HttpError(message, 404));
  }

  res.json(category);
}

export async function deleteCategoryHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const message = "Error deleting Category";

  const { id } = req.params;

  const category = await deleteCategory(id!);

  if (!category) {
    return next(new HttpError(message, 404));
  }

  res.json(category);
}

// Products
export async function findAllProductsHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const products = await findAllProducts();

  if (!products || products?.length < 1) {
    return next(new HttpError("No product is found", 404));
  }

  res.json(products);
}

export async function findProductByIdHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const product = await findProductById(id!);

  if (!product) {
    return next(new HttpError("Product not found", 404));
  }

  res.json(product);
}

export async function newProductHandler(
  req: Request<{}, {}, NewProductInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Error creating new product";
  const body = req.body;

  const product = await createProduct(body);

  if (!product) {
    return next(new HttpError(message, 404));
  }

  res.json(product);
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating Product";
  const body = req.body;
  const { id } = req.params;

  const product = await updateProduct(
    { _id: id },
    {
      ...body,
    }
  );

  if (!product) {
    return next(new HttpError(message, 404));
  }

  res.json(product);
}

export async function deleteProductHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const message = "Error deleting Product";

  const { id } = req.params;

  const product = await deleteProduct(id!);

  if (!product) {
    return next(new HttpError(message, 404));
  }

  res.json(product);
}

// Extras
export async function findAllExtrasHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const extras = await findAllExtras();

  if (!extras || extras?.length < 1) {
    return next(new HttpError("No extra is found", 404));
  }

  res.json(extras);
}

export async function findExtraByIdHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const extra = await findExtraById(id!);

  if (!extra) {
    return next(new HttpError("Extra not found", 404));
  }

  res.json(extra);
}

export async function newExtraHandler(
  req: Request<{}, {}, NewExtraInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Error creating new extra";
  const body = req.body;

  const extra = await createExtra(body);

  if (!extra) {
    return next(new HttpError(message, 404));
  }

  res.json(extra);
}

export async function updateExtraHandler(
  req: Request<UpdateExtraInput["params"], {}, UpdateExtraInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating Extra";
  const body = req.body;
  const { id } = req.params;

  const extra = await updateExtra(
    { _id: id },
    {
      ...body,
    }
  );

  if (!extra) {
    return next(new HttpError(message, 404));
  }

  res.json(extra);
}

export async function deleteExtraHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const message = "Error deleting Extra";

  const { id } = req.params;

  const extra = await deleteExtra(id!);

  if (!extra) {
    return next(new HttpError(message, 404));
  }

  res.json(extra);
}

// Extra Items
export async function findAllExtraItemsHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const extraItems = await findAllExtraItems();

  if (!extraItems || extraItems?.length < 1) {
    return next(new HttpError("No Extra Item is found", 404));
  }

  res.json(extraItems);
}

export async function findExtraItemByIdHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const extraItem = await findExtraItemById(id!);

  if (!extraItem) {
    return next(new HttpError("Extra Item not found", 404));
  }

  res.json(extraItem);
}

export async function newExtraItemHandler(
  req: Request<{}, {}, NewExtraItemInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Error creating new Extra Item";
  const body = req.body;

  const extraItem = await createExtraItem(body);

  if (!extraItem) {
    return next(new HttpError(message, 404));
  }

  res.json(extraItem);
}

export async function updateExtraItemHandler(
  req: Request<
    UpdateExtraItemInput["params"],
    {},
    UpdateExtraItemInput["body"]
  >,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating ExtraItem";
  const body = req.body;
  const { id } = req.params;

  const extraItem = await updateExtraItem(
    { _id: id },
    {
      ...body,
    }
  );

  if (!extraItem) {
    return next(new HttpError(message, 404));
  }

  res.json(extraItem);
}

export async function deleteExtraItemHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const message = "Error deleting ExtraItem";

  const { id } = req.params;

  const extraItem = await deleteExtraItem(id!);

  if (!extraItem) {
    return next(new HttpError(message, 404));
  }

  res.json(extraItem);
}
