import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
  }),
});

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1, 'Label is required').default('Home'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    landmark: z.string().optional(),
    pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    is_default: z.boolean().optional().default(false),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1).optional(),
    address: z.string().min(5).optional(),
    landmark: z.string().optional(),
    pincode: z.string().regex(/^[0-9]{6}$/).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    is_default: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
});

export const addressIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
});
