import { Response, Request, NextFunction } from "express";

import HttpError from "../model/http-error";
import {
  createRestaurant,
  deleteRestaurant,
  findRestaurant,
  updateRestaurant,
} from "../service/restaurant.service";
import {
  DeleteRestaurantInput,
  NewRestaurantInput,
  UpdateRestaurantInput,
} from "../schema/restaurant.schema";

export async function findRestaurantHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const restaurant = await findRestaurant();

  if (!restaurant || restaurant.length < 1) {
    return next(new HttpError("No restaurant is available", 404));
  }

  res.json({ restaurant: restaurant[0] });
}

export async function newRestaurantHandler(
  req: Request<{}, {}, NewRestaurantInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Error creating new restaurant";
  const body = req.body;

  const restaurant = await createRestaurant(body);

  if (!restaurant) {
    return next(new HttpError(message, 404));
  }

  res.json(restaurant);
}

export async function updateRestaurantHandler(
  req: Request<
    UpdateRestaurantInput["params"],
    {},
    UpdateRestaurantInput["body"]
  >,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating restaurant";
  const body = req.body;
  const { id } = req.params;

  const restaurant = await updateRestaurant(
    { _id: id },
    {
      ...body,
    }
  );

  if (!restaurant) {
    return next(new HttpError(message, 404));
  }

  res.json(restaurant);
}

export async function deleteRestaurantHandler(
  req: Request<DeleteRestaurantInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Error deleting restaurant";
  const { id } = req.params;

  const restaurant = await deleteRestaurant(id);

  if (!restaurant) {
    return next(new HttpError(message, 404));
  }

  res.json(restaurant);
}
