import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

import HttpError from "../model/http-error";

const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const message = error.issues
        .map((err: any) => `${err.message} - path: ${err.path.join(",")}`)
        .join(" \n ");

      console.log(error);
      return next(new HttpError(message, 409));
    }
  };

export default validateSchema;
