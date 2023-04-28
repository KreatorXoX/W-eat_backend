import { NextFunction, Request, Response } from "express";

import HttpError from "../model/http-error";

import { verifyJwt } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: string;
  isAdmin?: boolean;
}

interface AccessTokenType {
  UserInfo: {
    _id: string;
    email: string;
    isAdmin: boolean;
  };
  exp: number;
  iat: number;
}

const verifyAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new HttpError("Unauthorized", 401));
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt<AccessTokenType>(
      accessToken,
      "accessTokenSecret"
    );

    if (!decoded?.UserInfo.isAdmin) {
      return next(
        new HttpError("You are not authorized to access this resource", 403)
      );
    }
    next();
  } catch (error) {
    return next(new HttpError("Forbidden", 403));
  }
};

export default verifyAdmin;
