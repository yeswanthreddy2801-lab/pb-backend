"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionIdParamSchema = exports.createSubscriptionSchema = void 0;
const zod_1 = require("zod");
exports.createSubscriptionSchema = zod_1.z.object({
    body: zod_1.z.object({
        plan_id: zod_1.z.string().uuid('Invalid plan ID'),
        address_id: zod_1.z.string().uuid('Invalid address ID'),
        duration_days: zod_1.z.number().int().positive().default(30),
        notes: zod_1.z.string().optional(),
        items: zod_1.z.array(zod_1.z.object({
            food_item_id: zod_1.z.string().uuid('Invalid food item ID'),
            quantity: zod_1.z.number().int().positive().default(1),
        })).min(1, 'At least one food item must be selected'),
    }),
});
exports.subscriptionIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid subscription ID'),
    }),
});
