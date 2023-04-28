import { Response, Request, NextFunction } from "express";

import HttpError from "../model/http-error";

import { findAllUsers, findUserByIdForClient } from "../service/user.service";

import { FindUserByIdInpupt } from "../schema/user.schema";

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
  req: Request<FindUserByIdInpupt, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const user = await findUserByIdForClient(id);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  res.json(user);
}
