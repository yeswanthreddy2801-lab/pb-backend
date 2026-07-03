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

export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    category: z.string().min(2, 'Category must be at least 2 characters'),
    base_price: z.number().min(0),
    max_items: z.number().int().min(1).default(6),
    color: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const updatePlanSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    category: z.string().min(2).optional(),
    base_price: z.number().min(0).optional(),
    max_items: z.number().int().min(1).optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    is_active: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid plan ID'),
  }),
});

export const planIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid plan ID'),
  }),
});

