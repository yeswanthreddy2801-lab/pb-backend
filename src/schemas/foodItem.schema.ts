import { z } from 'zod';

export const createFoodItemSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    category: z.string().min(2, 'Category is required'),
    plan_type: z.string().min(2, 'Plan type is required'),
    protein_g: z.number().nonnegative('Protein must be a positive number'),
    calories: z.number().int().nonnegative('Calories must be a positive integer'),
    price: z.number().nonnegative('Price must be a positive number'),
    image_url: z.string().url('Must be a valid URL').optional().nullable(),
    emoji: z.string().max(10).optional().nullable(),
    color: z.string().max(20).optional().nullable(),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional().default(true),
    is_available: z.boolean().optional().default(true),
    sort_order: z.number().int().optional().default(0),
  }),
});

export const updateFoodItemSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    category: z.string().min(2).optional(),
    plan_type: z.string().min(2).optional(),
    protein_g: z.number().nonnegative().optional(),
    calories: z.number().int().nonnegative().optional(),
    price: z.number().nonnegative().optional(),
    image_url: z.string().url().optional().nullable(),
    emoji: z.string().max(10).optional().nullable(),
    color: z.string().max(20).optional().nullable(),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
    is_available: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid food item ID'),
  }),
});

export const foodItemIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid food item ID'),
  }),
});
