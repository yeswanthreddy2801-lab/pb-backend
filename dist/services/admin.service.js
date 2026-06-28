"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFoodItemAvailability = exports.deleteFoodItem = exports.updateFoodItem = exports.createFoodItem = exports.getInventory = exports.getCustomerById = exports.getCustomers = exports.rejectOrder = exports.approveOrder = exports.getOrderById = exports.getOrders = exports.getStats = void 0;
const supabase_1 = require("../config/supabase");
const constants_1 = require("../config/constants");
const notifications_service_1 = require("./notifications.service");
const getStats = async () => {
    const [pendingCountRes, activeCountRes, expiringRes, todayDeliveriesRes, revenueRes, customersRes] = await Promise.all([
        supabase_1.supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', constants_1.SUBSCRIPTION_STATUS.PENDING),
        supabase_1.supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', constants_1.SUBSCRIPTION_STATUS.ACTIVE),
        // Mocking expiring this week (requires date logic, doing a simpler count for now)
        supabase_1.supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', constants_1.SUBSCRIPTION_STATUS.ACTIVE),
        // Mocking today deliveries
        supabase_1.supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', constants_1.SUBSCRIPTION_STATUS.ACTIVE),
        // Monthly revenue: summing total_price where status is active
        supabase_1.supabase.from('subscriptions').select('total_price').eq('status', constants_1.SUBSCRIPTION_STATUS.ACTIVE),
        supabase_1.supabase.from('users').select('*', { count: 'exact', head: true })
    ]);
    const monthlyRevenue = revenueRes.data?.reduce((sum, sub) => sum + Number(sub.total_price), 0) || 0;
    return {
        pendingCount: pendingCountRes.count || 0,
        activeCount: activeCountRes.count || 0,
        expiringThisWeek: expiringRes.count || 0, // Mock
        todayDeliveries: todayDeliveriesRes.count || 0, // Mock
        monthlyRevenue,
        totalCustomers: customersRes.count || 0,
    };
};
exports.getStats = getStats;
const getOrders = async (status, search, page = 1, limit = 20) => {
    let query = supabase_1.supabase
        .from('subscriptions')
        .select(`*, users (name, mobile), subscription_plans (name)`, { count: 'exact' })
        .order('created_at', { ascending: false });
    if (status) {
        query = query.eq('status', status);
    }
    const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);
    if (error)
        throw new Error('Failed to fetch orders');
    return { data, count: count || 0 };
};
exports.getOrders = getOrders;
const getOrderById = async (id) => {
    const { data, error } = await supabase_1.supabase
        .from('subscriptions')
        .select(`
      *,
      users (*),
      subscription_plans (*),
      addresses (*),
      subscription_items (
        *,
        food_items (*)
      )
    `)
        .eq('id', id)
        .single();
    if (error)
        throw new Error('Order not found');
    return data;
};
exports.getOrderById = getOrderById;
const approveOrder = async (subscriptionId, adminId) => {
    const order = await (0, exports.getOrderById)(subscriptionId);
    if (order.status !== constants_1.SUBSCRIPTION_STATUS.PENDING) {
        throw new Error('Only pending orders can be approved');
    }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + order.duration_days);
    const { data, error } = await supabase_1.supabase
        .from('subscriptions')
        .update({
        status: constants_1.SUBSCRIPTION_STATUS.APPROVED, // Will change to ACTIVE once delivery starts, keeping simple
        approved_at: new Date().toISOString(),
        approved_by: adminId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
    })
        .eq('id', subscriptionId)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to approve order');
    await supabase_1.supabase.from('approvals').insert([{
            subscription_id: subscriptionId,
            admin_id: adminId,
            action: 'approved',
        }]);
    await (0, notifications_service_1.createNotification)(order.user_id, 'subscription_approved', 'Subscription Approved', 'Your subscription has been approved!');
    await supabase_1.supabase.from('activity_logs').insert([{
            actor_id: adminId,
            actor_type: 'admin',
            action: 'approved_subscription',
            entity_type: 'subscription',
            entity_id: subscriptionId,
        }]);
    return data;
};
exports.approveOrder = approveOrder;
const rejectOrder = async (subscriptionId, adminId, reason) => {
    const order = await (0, exports.getOrderById)(subscriptionId);
    const { data, error } = await supabase_1.supabase
        .from('subscriptions')
        .update({
        status: constants_1.SUBSCRIPTION_STATUS.REJECTED,
        rejection_reason: reason,
    })
        .eq('id', subscriptionId)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to reject order');
    await supabase_1.supabase.from('approvals').insert([{
            subscription_id: subscriptionId,
            admin_id: adminId,
            action: 'rejected',
            notes: reason,
        }]);
    await (0, notifications_service_1.createNotification)(order.user_id, 'subscription_rejected', 'Subscription Rejected', `Your subscription was rejected. Reason: ${reason}`);
    await supabase_1.supabase.from('activity_logs').insert([{
            actor_id: adminId,
            actor_type: 'admin',
            action: 'rejected_subscription',
            entity_type: 'subscription',
            entity_id: subscriptionId,
            metadata: { reason },
        }]);
    return data;
};
exports.rejectOrder = rejectOrder;
const getCustomers = async (search, page = 1, limit = 20) => {
    let query = supabase_1.supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
    if (search) {
        query = query.or(`name.ilike.%${search}%,mobile.ilike.%${search}%`);
    }
    const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);
    if (error)
        throw new Error('Failed to fetch customers');
    return { data, count: count || 0 };
};
exports.getCustomers = getCustomers;
const getCustomerById = async (id) => {
    const { data: user, error: userError } = await supabase_1.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    if (userError)
        throw new Error('Customer not found');
    const { data: subscriptions } = await supabase_1.supabase
        .from('subscriptions')
        .select('*, subscription_plans(name)')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
    return { ...user, subscriptions };
};
exports.getCustomerById = getCustomerById;
const getInventory = async () => {
    const { data, error } = await supabase_1.supabase
        .from('food_items')
        .select('*')
        .order('sort_order', { ascending: true });
    if (error)
        throw new Error('Failed to fetch inventory');
    return data;
};
exports.getInventory = getInventory;
const createFoodItem = async (adminId, payload) => {
    const { data, error } = await supabase_1.supabase
        .from('food_items')
        .insert([payload])
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to create food item');
    await supabase_1.supabase.from('activity_logs').insert([{
            actor_id: adminId,
            actor_type: 'admin',
            action: 'created_food_item',
            entity_type: 'food_item',
            entity_id: data.id,
        }]);
    return data;
};
exports.createFoodItem = createFoodItem;
const updateFoodItem = async (adminId, id, payload) => {
    const { data, error } = await supabase_1.supabase
        .from('food_items')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to update food item');
    await supabase_1.supabase.from('activity_logs').insert([{
            actor_id: adminId,
            actor_type: 'admin',
            action: 'updated_food_item',
            entity_type: 'food_item',
            entity_id: id,
        }]);
    return data;
};
exports.updateFoodItem = updateFoodItem;
const deleteFoodItem = async (adminId, id) => {
    const { error } = await supabase_1.supabase
        .from('food_items')
        .update({ is_active: false })
        .eq('id', id);
    if (error)
        throw new Error('Failed to delete food item');
    await supabase_1.supabase.from('activity_logs').insert([{
            actor_id: adminId,
            actor_type: 'admin',
            action: 'deleted_food_item',
            entity_type: 'food_item',
            entity_id: id,
        }]);
    return true;
};
exports.deleteFoodItem = deleteFoodItem;
const toggleFoodItemAvailability = async (adminId, id) => {
    const { data: item } = await supabase_1.supabase.from('food_items').select('is_available').eq('id', id).single();
    if (!item)
        throw new Error('Food item not found');
    const { data, error } = await supabase_1.supabase
        .from('food_items')
        .update({ is_available: !item.is_available })
        .eq('id', id)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to toggle availability');
    await supabase_1.supabase.from('activity_logs').insert([{
            actor_id: adminId,
            actor_type: 'admin',
            action: 'toggled_food_item',
            entity_type: 'food_item',
            entity_id: id,
        }]);
    return data;
};
exports.toggleFoodItemAvailability = toggleFoodItemAvailability;
