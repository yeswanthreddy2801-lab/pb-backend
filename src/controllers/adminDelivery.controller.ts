import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as adminDeliveryService from '../services/adminDelivery.service';

export const getDeliveryStaff = async (req: Request, res: Response) => {
  try {
    const data = await adminDeliveryService.getAllDeliveryStaff();
    return sendSuccess(res, data, 'Delivery staff fetched successfully');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};

export const createDeliveryStaff = async (req: Request, res: Response) => {
  try {
    const data = await adminDeliveryService.createDeliveryStaff(req.body);
    return sendSuccess(res, data, 'Delivery staff created successfully');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};

export const getTodayDeliveries = async (req: Request, res: Response) => {
  try {
    const data = await adminDeliveryService.getAllTodayDeliveries();
    return sendSuccess(res, data, 'Today deliveries fetched successfully');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};

export const assignDelivery = async (req: Request, res: Response) => {
  try {
    const data = await adminDeliveryService.assignDelivery(req.body);
    return sendSuccess(res, data, 'Delivery assigned successfully');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};

export const reassignDelivery = async (req: Request, res: Response) => {
  try {
    const { deliveryId } = req.params;
    const { deliveryBoyId } = req.body;
    const data = await adminDeliveryService.reassignDelivery(deliveryId, deliveryBoyId);
    return sendSuccess(res, data, 'Delivery reassigned successfully');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};

export const getDeliveryStats = async (req: Request, res: Response) => {
  try {
    const data = await adminDeliveryService.getDeliveryStats();
    return sendSuccess(res, data, 'Delivery stats fetched successfully');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};

export const bulkAssignDeliveries = async (req: Request, res: Response) => {
  try {
    const data = await adminDeliveryService.bulkAssignDeliveries(req.body);
    return sendSuccess(res, data, 'Bulk assign successful');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};
