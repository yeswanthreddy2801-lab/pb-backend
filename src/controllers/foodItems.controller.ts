import { Request, Response } from 'express';
import * as foodItemsService from '../services/foodItems.service';
import { sendSuccess, sendError } from '../utils/response';

export const getFoodItems = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const items = await foodItemsService.getFoodItems(filters);
    return sendSuccess(res, items);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getFoodItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await foodItemsService.getFoodItemById(id);
    return sendSuccess(res, item);
  } catch (error: any) {
    return sendError(res, error.message, null, 404);
  }
};

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await foodItemsService.getPlans();
    return sendSuccess(res, plans);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
