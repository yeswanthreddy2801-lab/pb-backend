import { supabase } from '../config/supabase';

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  metadata?: any
) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, type, title, message, metadata }])
    .select('*')
    .single();

  if (error) {
    console.error('Failed to create notification', error);
  }
  return data;
};

export const getNotifications = async (userId: string, page = 1, limit = 20, isRead?: boolean) => {
  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (isRead !== undefined) {
    query = query.eq('is_read', isRead);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw new Error('Failed to fetch notifications');
  return { data, count: count || 0 };
};

export const getUnreadCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error('Failed to fetch unread count');
  return { count: count || 0 };
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw new Error('Failed to mark notification as read');
  return data;
};

export const markAllAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error('Failed to mark all as read');
  return true;
};
