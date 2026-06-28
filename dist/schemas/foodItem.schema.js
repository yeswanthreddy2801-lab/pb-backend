"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodItemIdParamSchema = exports.updateFoodItemSchema = exports.createFoodItemSchema = void 0;
const zod_1 = require("zod");
exports.createFoodItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name is required'),
        category: zod_1.z.string().min(2, 'Category is required'),
        plan_type: zod_1.z.string().min(2, 'Plan type is required'),
        protein_g: zod_1.z.number().nonnegative('Protein must be a positive number'),
        calories: zod_1.z.number().int().nonnegative('Calories must be a positive integer'),
        price: zod_1.z.number().nonnegative('Price must be a positive number'),
        image_url: zod_1.z.string().url('Must be a valid URL').optional().nullable(),
        emoji: zod_1.z.string().max(10).optional().nullable(),
        color: zod_1.z.string().max(20).optional().nullable(),
        description: zod_1.z.string().optional().nullable(),
        is_active: zod_1.z.boolean().optional().default(true),
        is_available: zod_1.z.boolean().optional().default(true),
        sort_order: zod_1.z.number().int().optional().default(0),
    }),
});
exports.updateFoodItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        category: zod_1.z.string().min(2).optional(),
        plan_type: zod_1.z.string().min(2).optional(),
        protein_g: zod_1.z.number().nonnegative().optional(),
        calories: zod_1.z.number().int().nonnegative().optional(),
        price: zod_1.z.number().nonnegative().optional(),
        image_url: zod_1.z.string().url().optional().nullable(),
        emoji: zod_1.z.string().max(10).optional().nullable(),
        color: zod_1.z.string().max(20).optional().nullable(),
        description: zod_1.z.string().optional().nullable(),
        is_active: zod_1.z.boolean().optional(),
        is_available: zod_1.z.boolean().optional(),
        sort_order: zod_1.z.number().int().optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid food item ID'),
    }),
});
exports.foodItemIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid food item ID'),
    }),
});
