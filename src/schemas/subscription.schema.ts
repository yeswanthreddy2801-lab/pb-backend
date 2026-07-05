import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    plan_id: z.string().uuid('Invalid plan ID'),
    address_id: z.string().uuid('Invalid address ID'),
    duration_days: z.number().int().positive().default(30),
    notes: z.string().optional(),
    items: z.array(z.object({
      food_item_id: z.string().uuid('Invalid food item ID'),
      quantity: z.number().int().positive().default(1),
    })).optional().default([]),
  }),
});

export const subscriptionIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid subscription ID'),
  }),
});
