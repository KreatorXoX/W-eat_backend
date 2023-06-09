import { Response, Request, NextFunction } from "express";

import HttpError from "../model/http-error";

import {
  findAllUsers,
  findAndUpdateUser,
  findOrderByUser,
  findUserByIdForClient,
} from "../service/user.service";

import { FindUserByIdInput, UpdateUserInput } from "../schema/user.schema";
import { isDocument } from "@typegoose/typegoose";

export async function findAllUsersHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const users = await findAllUsers();

  if (!users || users?.length < 1) {
    return next(new HttpError("No user is available", 404));
  }

  res.json(users);
}

export async function findUserByIdForClientHandler(
  req: Request<FindUserByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const user = await findUserByIdForClient(id!);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  res.json(user);
}

export async function findOrdersByUserHandler(
  req: Request<FindUserByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const userWithOrders = await findOrderByUser(id!);

  if (!userWithOrders) {
    return next(new HttpError("User not found", 404));
  }

  const favouriteOrders = userWithOrders.orders?.filter((order) => {
    if (isDocument(order)) {
      return order.isFavourite === true;
    }
  });

  const allOrders = userWithOrders.orders;

  res.json({ allOrders, favouriteOrders });
}

// Update User
export async function updateUserHandler(
  req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating User";
  const body = req.body;
  const { id } = req.params;

  const user = await findAndUpdateUser(
    { _id: id },
    {
      ...body,
    }
  );

  if (!user) {
    return next(new HttpError(message, 404));
  }

  res.json({ id: user._id });
}
