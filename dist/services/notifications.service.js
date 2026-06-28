"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getNotifications = exports.createNotification = void 0;
const supabase_1 = require("../config/supabase");
const createNotification = async (userId, type, title, message, metadata) => {
    const { data, error } = await supabase_1.supabase
        .from('notifications')
        .insert([{ user_id: userId, type, title, message, metadata }])
        .select('*')
        .single();
    if (error) {
        console.error('Failed to create notification', error);
    }
    return data;
};
exports.createNotification = createNotification;
const getNotifications = async (userId, page = 1, limit = 20, isRead) => {
    let query = supabase_1.supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (isRead !== undefined) {
        query = query.eq('is_read', isRead);
    }
    const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);
    if (error)
        throw new Error('Failed to fetch notifications');
    return { data, count: count || 0 };
};
exports.getNotifications = getNotifications;
const getUnreadCount = async (userId) => {
    const { count, error } = await supabase_1.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    if (error)
        throw new Error('Failed to fetch unread count');
    return { count: count || 0 };
};
exports.getUnreadCount = getUnreadCount;
const markAsRead = async (userId, notificationId) => {
    const { data, error } = await supabase_1.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to mark notification as read');
    return data;
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (userId) => {
    const { error } = await supabase_1.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    if (error)
        throw new Error('Failed to mark all as read');
    return true;
};
exports.markAllAsRead = markAllAsRead;
