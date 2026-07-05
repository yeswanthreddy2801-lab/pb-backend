import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateDeliveryToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export const loginDeliveryBoy = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return sendError(res, 'Mobile and password are required', null, 400);
    }

    const { data: deliveryBoy, error } = await supabase
      .from('delivery_staff')
      .select('*')
      .eq('mobile', mobile)
      .single();

    if (error || !deliveryBoy) {
      return sendError(res, 'Invalid credentials', null, 401);
    }

    if (!deliveryBoy.is_active) {
      return sendError(res, 'Account disabled', null, 403);
    }

    const isMatch = await bcrypt.compare(password, deliveryBoy.password_hash);
    
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', null, 401);
    }

    const token = generateDeliveryToken({
      deliveryBoyId: deliveryBoy.id,
      mobile: deliveryBoy.mobile,
      name: deliveryBoy.name
    });

    return sendSuccess(res, {
      token,
      deliveryBoy: {
        id: deliveryBoy.id,
        name: deliveryBoy.name,
        mobile: deliveryBoy.mobile,
        role: 'delivery_boy'
      }
    }, 'Login successful');

  } catch (error: any) {
    console.error('Delivery login error:', error);
    return sendError(res, 'Internal server error', error.message, 500);
  }
};
