import { NextFunction, Response } from 'express';
import { isAdminSub } from '../baseblocks/admin/admin.service';
import { RequestContext } from '../util/request-context.type';

export const isAdmin = async (
  req: RequestContext,
  res: Response,
  next: NextFunction,
) => {
  const userSub = req.currentUserSub;
  const isAdmin = await isAdminSub(userSub);
  if (!isAdmin) {
    res.status(403).json({
      error: 'User does not have permission',
    });
    return;
  }
  next();
};
