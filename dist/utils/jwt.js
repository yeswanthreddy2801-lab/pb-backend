"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAdminToken = exports.generateUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateUserToken = (payload) => {
    return jsonwebtoken_1.default.sign({ ...payload, role: 'user' }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_USER_EXPIRY,
    });
};
exports.generateUserToken = generateUserToken;
const generateAdminToken = (payload) => {
    return jsonwebtoken_1.default.sign({ ...payload, role: 'admin' }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_ADMIN_EXPIRY,
    });
};
exports.generateAdminToken = generateAdminToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
