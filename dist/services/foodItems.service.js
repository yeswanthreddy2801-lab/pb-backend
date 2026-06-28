"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodItemById = exports.getFoodItems = void 0;
const supabase_1 = require("../config/supabase");
const getFoodItems = async (filters) => {
    let query = supabase_1.supabase.from('food_items').select('*').order('sort_order', { ascending: true });
    if (filters.category) {
        query = query.eq('category', filters.category);
    }
    if (filters.planType) {
        // If planType is nonveg, return nonveg and both
        // If planType is veg, return veg and both
        query = query.in('plan_type', [filters.planType, 'both']);
    }
    if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive === 'true');
    }
    else {
        // By default for public users, only show active
        query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error)
        throw new Error('Failed to fetch food items');
    return data;
};
exports.getFoodItems = getFoodItems;
const getFoodItemById = async (id) => {
    const { data, error } = await supabase_1.supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single();
    if (error)
        throw new Error('Food item not found');
    return data;
};
exports.getFoodItemById = getFoodItemById;
