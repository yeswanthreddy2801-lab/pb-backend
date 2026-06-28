import { Request, Response } from 'express';
import * as usersService from '../services/users.service';
import { sendSuccess, sendError } from '../utils/response';

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId || (req.user as any).adminId;
    const user = await usersService.getUserById(userId);
    return sendSuccess(res, user);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId || (req.user as any).adminId;
    const user = await usersService.updateUserProfile(userId, req.body);
    return sendSuccess(res, user, 'Profile updated successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const addresses = await usersService.getAddresses(userId);
    return sendSuccess(res, addresses);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const address = await usersService.createAddress(userId, req.body);
    return sendSuccess(res, address, 'Address created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const address = await usersService.updateAddress(userId, id, req.body);
    return sendSuccess(res, address, 'Address updated successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    await usersService.deleteAddress(userId, id);
    return sendSuccess(res, null, 'Address deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const address = await usersService.setDefaultAddress(userId, id);
    return sendSuccess(res, address, 'Default address updated');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
