import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { ROLES } from '../config/constants';

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', null, 401);
  }

  if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.SUPERADMIN) {
    return sendError(res, 'Admin access required', null, 403);
  }

  next();
};
