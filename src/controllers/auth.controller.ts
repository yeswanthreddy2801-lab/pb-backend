import { Request, Response } from 'express';
import { loginUser, loginAdmin } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const login = async (req: Request, res: Response) => {
  try {
    const { mobile, name } = req.body;
    const data = await loginUser(mobile, name);
    return sendSuccess(res, data, 'Login successful');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const checkUser = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const exists = await require('../services/auth.service').checkUserExists(mobile);
    return sendSuccess(res, { exists }, 'User checked successfully');
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
  try {
    const { supabase } = require('../config/supabase');
    if (req.user?.adminId) {
      const { data: admin } = await supabase.from('admins').select('*').eq('id', req.user.adminId).single();
      return sendSuccess(res, admin);
    } else if (req.user?.userId) {
      const { data: user } = await supabase.from('users').select('*').eq('id', req.user.userId).single();
      return sendSuccess(res, user);
    }
    return sendError(res, 'Invalid user session', null, 401);
  } catch (err: any) {
    return sendError(res, err.message);
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any).adminId;
    if (!adminId) return sendError(res, 'Admin not found in token', null, 401);

    const { currentPassword, newPassword } = req.body;
    await require('../services/auth.service').changeAdminPassword(adminId, currentPassword, newPassword);
    
    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
