import { NextFunction, Request, Response } from "express";
import { ApiError } from "./api-error";

export function apiErrorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.status).json(err);
    return;
  }

  res.status(500).json('something went wrong');
}
