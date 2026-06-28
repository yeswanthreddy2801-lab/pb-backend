"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendPaginated = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
    });
};
exports.sendSuccess = sendSuccess;
const sendPaginated = (res, data, pagination, message) => {
    return res.status(200).json({
        success: true,
        data,
        pagination,
        message,
    });
};
exports.sendPaginated = sendPaginated;
const sendError = (res, error, details, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        error,
        details,
    });
};
exports.sendError = sendError;
