import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getStats();
    return sendSuccess(res, stats);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { data, count } = await adminService.getOrders(status, search, page, limit);
    return sendPaginated(res, data, {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await adminService.getOrderById(id);
    return sendSuccess(res, order);
  } catch (error: any) {
    return sendError(res, error.message, null, 404);
  }
};

export const approveOrder = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    const order = await adminService.approveOrder(id, adminId);
    return sendSuccess(res, order, 'Order approved successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const rejectOrder = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    const { reason } = req.body;
    const order = await adminService.rejectOrder(id, adminId, reason);
    return sendSuccess(res, order, 'Order rejected successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { data, count } = await adminService.getCustomers(search, page, limit);
    return sendPaginated(res, data, {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await adminService.getCustomerById(id);
    return sendSuccess(res, customer);
  } catch (error: any) {
    return sendError(res, error.message, null, 404);
  }
};

export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await adminService.getInventory();
    return sendSuccess(res, inventory);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createFoodItem = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const item = await adminService.createFoodItem(adminId, req.body);
    return sendSuccess(res, item, 'Food item created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateFoodItem = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    const item = await adminService.updateFoodItem(adminId, id, req.body);
    return sendSuccess(res, item, 'Food item updated successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const deleteFoodItem = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    await adminService.deleteFoodItem(adminId, id);
    return sendSuccess(res, null, 'Food item deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const toggleFoodItemAvailability = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    const item = await adminService.toggleFoodItemAvailability(adminId, id);
    return sendSuccess(res, item, 'Availability toggled successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// --- SUBSCRIPTION PLANS ---

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await adminService.getPlans();
    return sendSuccess(res, plans);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createPlan = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const plan = await adminService.createPlan(adminId, req.body);
    return sendSuccess(res, plan, 'Plan created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    const plan = await adminService.updatePlan(adminId, id, req.body);
    return sendSuccess(res, plan, 'Plan updated successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    const { id } = req.params;
    await adminService.deletePlan(adminId, id);
    return sendSuccess(res, null, 'Plan deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
