"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.adminLogin = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const login = async (req, res) => {
    try {
        const { mobile } = req.body;
        const data = await (0, auth_service_1.loginUser)(mobile);
        return (0, response_1.sendSuccess)(res, data, 'Login successful');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.login = login;
const adminLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const data = await (0, auth_service_1.loginAdmin)(mobile, password);
        return (0, response_1.sendSuccess)(res, data, 'Admin login successful');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message, null, 401);
    }
};
exports.adminLogin = adminLogin;
const logout = async (req, res) => {
    return (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
};
exports.logout = logout;
const getMe = async (req, res) => {
    return (0, response_1.sendSuccess)(res, req.user);
};
exports.getMe = getMe;
