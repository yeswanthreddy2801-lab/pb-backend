"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const response_1 = require("../utils/response");
const constants_1 = require("../config/constants");
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return (0, response_1.sendError)(res, 'Authentication required', null, 401);
    }
    if (req.user.role !== constants_1.ROLES.ADMIN && req.user.role !== constants_1.ROLES.SUPERADMIN) {
        return (0, response_1.sendError)(res, 'Admin access required', null, 403);
    }
    next();
};
exports.adminOnly = adminOnly;
