import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as deliveryService from '../services/delivery.service';
import { DeliveryStatus } from '../types/delivery.types';

export const getTodayDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const data = await deliveryService.getTodayDeliveries(deliveryBoyId);
    return sendSuccess(res, data, 'Today\'s deliveries fetched successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to fetch today\'s deliveries', error.message);
  }
};

export const getMyTodayDelivery = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const data = await deliveryService.getMyTodayDelivery(userId);
    return sendSuccess(res, data, 'Today delivery fetched successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to fetch today delivery', error.message);
  }
};

export const getPendingDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const data = await deliveryService.getPendingDeliveries(deliveryBoyId);
    return sendSuccess(res, data, 'Pending deliveries fetched successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to fetch pending deliveries', error.message);
  }
};

export const getCompletedDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const date = req.query.date as string | undefined;
    const data = await deliveryService.getCompletedDeliveries(deliveryBoyId, date);
    return sendSuccess(res, data, 'Completed deliveries fetched successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to fetch completed deliveries', error.message);
  }
};

export const getDeliveryStats = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const data = await deliveryService.getDeliveryStats(deliveryBoyId);
    return sendSuccess(res, data, 'Stats fetched successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to fetch stats', error.message);
  }
};

export const getDeliveryDetails = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const { deliveryId } = req.params;
    const data = await deliveryService.getDeliveryDetails(deliveryId, deliveryBoyId);
    return sendSuccess(res, data, 'Delivery details fetched successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to fetch delivery details', error.message);
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const { deliveryId } = req.params;
    const { status, failedReason } = req.body;

    if (!['out_for_delivery', 'delivered', 'failed'].includes(status)) {
      return sendError(res, 'Invalid status', null, 400);
    }

    const data = await deliveryService.updateDeliveryStatus(
      deliveryId, 
      deliveryBoyId, 
      status as DeliveryStatus, 
      failedReason
    );
    
    return sendSuccess(res, data, 'Status updated successfully');
  } catch (error: any) {
    const status = error.message.includes('Already marked') ? 409 : 
                   error.message.includes('unauthorized') ? 403 : 500;
    return sendError(res, error.message, null, status);
  }
};

export const markOutForDelivery = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.deliveryBoy!.deliveryBoyId;
    const { deliveryId } = req.params;
    
    const data = await deliveryService.markOutForDelivery(deliveryId, deliveryBoyId);
    
    return sendSuccess(res, data, 'Marked out for delivery');
  } catch (error: any) {
    return sendError(res, error.message, null, 500);
  }
};
