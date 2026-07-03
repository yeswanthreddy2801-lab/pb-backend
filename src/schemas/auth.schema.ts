import { z } from 'zod';

export const userLoginSchema = z.object({
  body: z.object({
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  }),
});

export const adminLoginSchema = z.object({
  body: z.object({
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const changeAdminPasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});
