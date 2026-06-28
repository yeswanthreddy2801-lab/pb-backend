"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getNotifications = void 0;
const notificationsService = __importStar(require("../services/notifications.service"));
const response_1 = require("../utils/response");
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const isReadStr = req.query.isRead;
        let isRead = undefined;
        if (isReadStr === 'true')
            isRead = true;
        if (isReadStr === 'false')
            isRead = false;
        const { data, count } = await notificationsService.getNotifications(userId, page, limit, isRead);
        return (0, response_1.sendPaginated)(res, data, {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        });
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.getNotifications = getNotifications;
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { count } = await notificationsService.getUnreadCount(userId);
        return (0, response_1.sendSuccess)(res, { count });
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.getUnreadCount = getUnreadCount;
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const notification = await notificationsService.markAsRead(userId, id);
        return (0, response_1.sendSuccess)(res, notification, 'Notification marked as read');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        await notificationsService.markAllAsRead(userId);
        return (0, response_1.sendSuccess)(res, null, 'All notifications marked as read');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.markAllAsRead = markAllAsRead;
