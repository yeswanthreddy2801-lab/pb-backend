import { Request, Response } from 'express';
import * as subscriptionsService from '../services/subscriptions.service';
import { sendSuccess, sendError } from '../utils/response';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const subscription = await subscriptionsService.createSubscription(userId, req.body);
    return sendSuccess(res, subscription, 'Subscription created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getMySubscriptions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const subscriptions = await subscriptionsService.getMySubscriptions(userId);
    return sendSuccess(res, subscriptions);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const subscription = await subscriptionsService.getSubscriptionById(userId, id);
    return sendSuccess(res, subscription);
  } catch (error: any) {
    return sendError(res, error.message, null, 404);
  }
};

export const renewSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const subscription = await subscriptionsService.renewSubscription(userId, id);
    return sendSuccess(res, subscription, 'Subscription renewed successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
