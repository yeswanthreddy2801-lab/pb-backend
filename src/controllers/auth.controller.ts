import { Request, Response } from 'express';
import { loginUser, loginAdmin } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const login = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const data = await loginUser(mobile);
    return sendSuccess(res, data, 'Login successful');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;
    const data = await loginAdmin(mobile, password);
    return sendSuccess(res, data, 'Admin login successful');
  } catch (error: any) {
    return sendError(res, error.message, null, 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: Request, res: Response) => {
  return sendSuccess(res, req.user);
};
