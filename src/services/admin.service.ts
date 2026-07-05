import { supabase } from '../config/supabase';
import { SUBSCRIPTION_STATUS } from '../config/constants';
import { createNotification } from './notifications.service';

export const getStats = async () => {
  const [
    pendingCountRes,
    activeCountRes,
    expiringRes,
    todayDeliveriesRes,
    revenueRes,
    customersRes
  ] = await Promise.all([
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', SUBSCRIPTION_STATUS.PENDING),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', SUBSCRIPTION_STATUS.ACTIVE),
    // Mocking expiring this week (requires date logic, doing a simpler count for now)
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', SUBSCRIPTION_STATUS.ACTIVE), 
    // Mocking today deliveries
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', SUBSCRIPTION_STATUS.ACTIVE),
    // Monthly revenue: summing total_price where status is active
    supabase.from('subscriptions').select('total_price').eq('status', SUBSCRIPTION_STATUS.ACTIVE),
    supabase.from('users').select('*', { count: 'exact', head: true })
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

export const getOrders = async (status?: string, search?: string, page = 1, limit = 20) => {
  let query = supabase
    .from('subscriptions')
    .select(`
      *, 
      users (name, mobile), 
      subscription_plans (*),
      addresses (*),
      subscription_items (
        *,
        food_items (*)
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);

  if (error) throw new Error('Failed to fetch orders');
  return { data, count: count || 0 };
};

export const getOrderById = async (id: string) => {
  const { data, error } = await supabase
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

  if (error) throw new Error('Order not found');
  return data;
};

export const approveOrder = async (subscriptionId: string, adminId: string) => {
  const order = await getOrderById(subscriptionId);
  if (order.status !== SUBSCRIPTION_STATUS.PENDING) {
    throw new Error('Only pending orders can be approved');
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + order.duration_days);

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: SUBSCRIPTION_STATUS.APPROVED, // Will change to ACTIVE once delivery starts, keeping simple
      approved_at: new Date().toISOString(),
      approved_by: adminId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    })
    .eq('id', subscriptionId)
    .select('*')
    .single();

  if (error) throw new Error('Failed to approve order');

  // Auto-schedule delivery for today
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('daily_deliveries').upsert({
    subscription_id: subscriptionId,
    customer_id: order.user_id,
    address_id: order.address_id || null,
    delivery_date: today,
    delivery_status: 'pending'
  }, { onConflict: 'subscription_id,delivery_date' });

  await supabase.from('approvals').insert([{
    subscription_id: subscriptionId,
    admin_id: adminId,
    action: 'approved',
  }]);

  await createNotification(order.user_id, 'subscription_approved', 'Subscription Approved', 'Your subscription has been approved!');

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'approved_subscription',
    entity_type: 'subscription',
    entity_id: subscriptionId,
  }]);

  return data;
};

export const rejectOrder = async (subscriptionId: string, adminId: string, reason: string) => {
  const order = await getOrderById(subscriptionId);
  
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: SUBSCRIPTION_STATUS.REJECTED,
      rejection_reason: reason,
    })
    .eq('id', subscriptionId)
    .select('*')
    .single();

  if (error) throw new Error('Failed to reject order');

  await supabase.from('approvals').insert([{
    subscription_id: subscriptionId,
    admin_id: adminId,
    action: 'rejected',
    notes: reason,
  }]);

  await createNotification(order.user_id, 'subscription_rejected', 'Subscription Rejected', `Your subscription was rejected. Reason: ${reason}`);

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'rejected_subscription',
    entity_type: 'subscription',
    entity_id: subscriptionId,
    metadata: { reason },
  }]);

  return data;
};

export const getCustomers = async (search?: string, page = 1, limit = 20) => {
  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,mobile.ilike.%${search}%`);
  }

  const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);

  if (error) throw new Error('Failed to fetch customers');
  return { data, count: count || 0 };
};

export const getCustomerById = async (id: string) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (userError) throw new Error('Customer not found');

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(name)')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  return { ...user, subscriptions };
};

export const getInventory = async () => {
  const { data, error } = await supabase
    .from('food_items')
    .select('id, name, category, planType:plan_type, protein:protein_g, calories, price, imageUrl:image_url, emoji, color, description, isActive:is_active, isAvailable:is_available, sortOrder:sort_order')
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Failed to fetch inventory');
  return data;
};

export const createFoodItem = async (adminId: string, payload: any) => {
  const { data, error } = await supabase
    .from('food_items')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw new Error('Failed to create food item');

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'created_food_item',
    entity_type: 'food_item',
    entity_id: data.id,
  }]);

  return data;
};

export const updateFoodItem = async (adminId: string, id: string, payload: any) => {
  const { data, error } = await supabase
    .from('food_items')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error('Failed to update food item');

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'updated_food_item',
    entity_type: 'food_item',
    entity_id: id,
  }]);

  return data;
};

export const deleteFoodItem = async (adminId: string, id: string) => {
  const { error } = await supabase
    .from('food_items')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new Error('Failed to delete food item');

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'deleted_food_item',
    entity_type: 'food_item',
    entity_id: id,
  }]);

  return true;
};

export const toggleFoodItemAvailability = async (adminId: string, id: string) => {
  const { data: item, error: findError } = await supabase.from('food_items').select('*').eq('id', id).single();
  if (findError || !item) throw new Error('Food item not found');

  const { data, error } = await supabase
    .from('food_items')
    .update({ is_available: !item.is_available, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'toggled_food_item',
    entity_type: 'food_item',
    entity_id: id,
  }]);

  return data;
};

// --- SUBSCRIPTION PLANS MANAGEMENT ---

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const createPlan = async (adminId: string, payload: any) => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'created_plan',
    entity_type: 'subscription_plan',
    entity_id: data.id,
  }]);

  return data;
};

export const updatePlan = async (adminId: string, id: string, payload: any) => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'updated_plan',
    entity_type: 'subscription_plan',
    entity_id: id,
  }]);

  return data;
};

export const deletePlan = async (adminId: string, id: string) => {
  const { error } = await supabase
    .from('subscription_plans')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  await supabase.from('activity_logs').insert([{
    actor_id: adminId,
    actor_type: 'admin',
    action: 'deleted_plan',
    entity_type: 'subscription_plan',
    entity_id: id,
  }]);

  return true;
};
