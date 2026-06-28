"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginSchema = exports.userLoginSchema = void 0;
const zod_1 = require("zod");
exports.userLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        mobile: zod_1.z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    }),
});
exports.adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        mobile: zod_1.z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
