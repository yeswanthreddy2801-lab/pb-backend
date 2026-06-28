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
exports.toggleFoodItemAvailability = exports.deleteFoodItem = exports.updateFoodItem = exports.createFoodItem = exports.getInventory = exports.getCustomerById = exports.getCustomers = exports.rejectOrder = exports.approveOrder = exports.getOrderById = exports.getOrders = exports.getStats = void 0;
const adminService = __importStar(require("../services/admin.service"));
const response_1 = require("../utils/response");
const getStats = async (req, res) => {
    try {
        const stats = await adminService.getStats();
        return (0, response_1.sendSuccess)(res, stats);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.getStats = getStats;
const getOrders = async (req, res) => {
    try {
        const status = req.query.status;
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { data, count } = await adminService.getOrders(status, search, page, limit);
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
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await adminService.getOrderById(id);
        return (0, response_1.sendSuccess)(res, order);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message, null, 404);
    }
};
exports.getOrderById = getOrderById;
const approveOrder = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { id } = req.params;
        const order = await adminService.approveOrder(id, adminId);
        return (0, response_1.sendSuccess)(res, order, 'Order approved successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.approveOrder = approveOrder;
const rejectOrder = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { id } = req.params;
        const { reason } = req.body;
        const order = await adminService.rejectOrder(id, adminId, reason);
        return (0, response_1.sendSuccess)(res, order, 'Order rejected successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.rejectOrder = rejectOrder;
const getCustomers = async (req, res) => {
    try {
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { data, count } = await adminService.getCustomers(search, page, limit);
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
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await adminService.getCustomerById(id);
        return (0, response_1.sendSuccess)(res, customer);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message, null, 404);
    }
};
exports.getCustomerById = getCustomerById;
const getInventory = async (req, res) => {
    try {
        const inventory = await adminService.getInventory();
        return (0, response_1.sendSuccess)(res, inventory);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.getInventory = getInventory;
const createFoodItem = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const item = await adminService.createFoodItem(adminId, req.body);
        return (0, response_1.sendSuccess)(res, item, 'Food item created successfully', 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.createFoodItem = createFoodItem;
const updateFoodItem = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { id } = req.params;
        const item = await adminService.updateFoodItem(adminId, id, req.body);
        return (0, response_1.sendSuccess)(res, item, 'Food item updated successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.updateFoodItem = updateFoodItem;
const deleteFoodItem = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { id } = req.params;
        await adminService.deleteFoodItem(adminId, id);
        return (0, response_1.sendSuccess)(res, null, 'Food item deleted successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.deleteFoodItem = deleteFoodItem;
const toggleFoodItemAvailability = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { id } = req.params;
        const item = await adminService.toggleFoodItemAvailability(adminId, id);
        return (0, response_1.sendSuccess)(res, item, 'Availability toggled successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.toggleFoodItemAvailability = toggleFoodItemAvailability;
