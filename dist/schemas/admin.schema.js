"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdParamSchema = exports.rejectOrderSchema = void 0;
const zod_1 = require("zod");
exports.rejectOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        reason: zod_1.z.string().min(5, 'Rejection reason must be at least 5 characters'),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid subscription ID'),
    }),
});
exports.orderIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid subscription ID'),
    }),
});
