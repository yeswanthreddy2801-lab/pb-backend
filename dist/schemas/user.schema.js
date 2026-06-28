"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressIdParamSchema = exports.updateAddressSchema = exports.createAddressSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        email: zod_1.z.string().email('Invalid email format').optional(),
    }),
});
exports.createAddressSchema = zod_1.z.object({
    body: zod_1.z.object({
        label: zod_1.z.string().min(1, 'Label is required').default('Home'),
        address: zod_1.z.string().min(5, 'Address must be at least 5 characters'),
        landmark: zod_1.z.string().optional(),
        pincode: zod_1.z.string().regex(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
        city: zod_1.z.string().min(2, 'City is required'),
        state: zod_1.z.string().min(2, 'State is required'),
        is_default: zod_1.z.boolean().optional().default(false),
    }),
});
exports.updateAddressSchema = zod_1.z.object({
    body: zod_1.z.object({
        label: zod_1.z.string().min(1).optional(),
        address: zod_1.z.string().min(5).optional(),
        landmark: zod_1.z.string().optional(),
        pincode: zod_1.z.string().regex(/^[0-9]{6}$/).optional(),
        city: zod_1.z.string().min(2).optional(),
        state: zod_1.z.string().min(2).optional(),
        is_default: zod_1.z.boolean().optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid address ID'),
    }),
});
exports.addressIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid address ID'),
    }),
});
