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
exports.getFoodItemById = exports.getFoodItems = void 0;
const foodItemsService = __importStar(require("../services/foodItems.service"));
const response_1 = require("../utils/response");
const getFoodItems = async (req, res) => {
    try {
        const filters = req.query;
        const items = await foodItemsService.getFoodItems(filters);
        return (0, response_1.sendSuccess)(res, items);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message);
    }
};
exports.getFoodItems = getFoodItems;
const getFoodItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await foodItemsService.getFoodItemById(id);
        return (0, response_1.sendSuccess)(res, item);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message, null, 404);
    }
};
exports.getFoodItemById = getFoodItemById;
