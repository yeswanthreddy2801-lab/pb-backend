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
const express_1 = require("express");
const adminController = __importStar(require("../controllers/admin.controller"));
const authenticate_1 = require("../middleware/authenticate");
const adminOnly_1 = require("../middleware/adminOnly");
const validate_1 = require("../middleware/validate");
const admin_schema_1 = require("../schemas/admin.schema");
const foodItem_schema_1 = require("../schemas/foodItem.schema");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate, adminOnly_1.adminOnly);
// Stats
router.get('/stats', adminController.getStats);
// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', (0, validate_1.validate)(admin_schema_1.orderIdParamSchema), adminController.getOrderById);
router.patch('/orders/:id/approve', (0, validate_1.validate)(admin_schema_1.orderIdParamSchema), adminController.approveOrder);
router.patch('/orders/:id/reject', (0, validate_1.validate)(admin_schema_1.rejectOrderSchema), adminController.rejectOrder);
// Customers
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomerById);
// Inventory
router.get('/inventory', adminController.getInventory);
router.post('/inventory', (0, validate_1.validate)(foodItem_schema_1.createFoodItemSchema), adminController.createFoodItem);
router.patch('/inventory/:id', (0, validate_1.validate)(foodItem_schema_1.updateFoodItemSchema), adminController.updateFoodItem);
router.delete('/inventory/:id', (0, validate_1.validate)(foodItem_schema_1.foodItemIdParamSchema), adminController.deleteFoodItem);
router.patch('/inventory/:id/toggle', (0, validate_1.validate)(foodItem_schema_1.foodItemIdParamSchema), adminController.toggleFoodItemAvailability);
exports.default = router;
