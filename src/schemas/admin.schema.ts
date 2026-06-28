import { z } from 'zod';

export const rejectOrderSchema = z.object({
  body: z.object({
    reason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid subscription ID'),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid subscription ID'),
  }),
});
