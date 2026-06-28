"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotals = void 0;
const calculateTotals = (items) => {
    return items.reduce((acc, item) => {
        acc.total_price += Number(item.price) * item.quantity;
        acc.total_protein += Number(item.protein_g) * item.quantity;
        acc.total_calories += Number(item.calories) * item.quantity;
        return acc;
    }, { total_price: 0, total_protein: 0, total_calories: 0 });
};
exports.calculateTotals = calculateTotals;
