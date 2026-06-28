import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface UserJwtPayload {
  userId: string;
  mobile: string;
  role: 'user';
  isNewUser: boolean;
}

export interface AdminJwtPayload {
  adminId: string;
  mobile: string;
  role: 'admin' | 'superadmin';
}

export const generateUserToken = (payload: Omit<UserJwtPayload, 'role'>): string => {
  return jwt.sign({ ...payload, role: 'user' }, env.JWT_SECRET as string, {
    expiresIn: env.JWT_USER_EXPIRY as any,
  });
};

export const generateAdminToken = (payload: Omit<AdminJwtPayload, 'role'>): string => {
  return jwt.sign({ ...payload, role: 'admin' }, env.JWT_SECRET as string, {
    expiresIn: env.JWT_ADMIN_EXPIRY as any,
  });
};

export const verifyToken = (token: string): UserJwtPayload | AdminJwtPayload => {
  return jwt.verify(token, env.JWT_SECRET as string) as UserJwtPayload | AdminJwtPayload;
};
