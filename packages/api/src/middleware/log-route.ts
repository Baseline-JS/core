import { NextFunction, Response } from 'express';
import { RequestContext } from '../util/request-context.type';

export const logRoute = (
  req: RequestContext,
  res: Response,
  next: NextFunction,
) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
};
