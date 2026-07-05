import { Request, Response, NextFunction } from 'express';
import { verifyDeliveryToken, DeliveryJwtPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      deliveryBoy?: DeliveryJwtPayload;
    }
  }
}

export const deliveryAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token missing or invalid', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyDeliveryToken(token);
    
    if (decoded.role !== 'delivery_boy') {
      return sendError(res, 'Delivery access required', null, 403);
    }

    req.deliveryBoy = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', null, 401);
  }
};
