import { supabase } from '../config/supabase';
import { calculateTotals } from '../utils/calculations';
import { SUBSCRIPTION_STATUS } from '../config/constants';
import { createNotification } from './notifications.service';

export const createSubscription = async (userId: string, payload: any) => {
  // 1. Validate food items
  const itemIds = payload.items.map((item: any) => item.food_item_id);
  
  const { data: foodItems, error: foodError } = await supabase
    .from('food_items')
    .select('*')
    .in('id', itemIds)
    .eq('is_active', true);

  if (foodError || !foodItems || foodItems.length !== itemIds.length) {
    throw new Error('One or more food items are invalid or inactive');
  }

  // 2-4. Calculate totals
  const itemsWithDetails = payload.items.map((item: any) => {
    const foodItem = foodItems.find(f => f.id === item.food_item_id);
    return {
      food_item_id: foodItem.id,
      quantity: item.quantity,
      price: foodItem.price,
      protein_g: foodItem.protein_g,
      calories: foodItem.calories,
    };
  });

  const totals = calculateTotals(itemsWithDetails);

  // 5. Insert subscription
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert([{
      user_id: userId,
      plan_id: payload.plan_id,
      address_id: payload.address_id,
      duration_days: payload.duration_days,
      notes: payload.notes,
      total_price: totals.total_price,
      total_protein: totals.total_protein,
      total_calories: totals.total_calories,
      status: SUBSCRIPTION_STATUS.PENDING,
    }])
    .select('*')
    .single();

  if (subError) throw new Error('Failed to create subscription');

  // 6. Insert items
  const subItems = itemsWithDetails.map((item: any) => ({
    subscription_id: subscription.id,
    food_item_id: item.food_item_id,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('subscription_items')
    .insert(subItems);

  if (itemsError) throw new Error('Failed to create subscription items');

  // 7. Create notification
  await createNotification(
    userId,
    'subscription_created',
    'Subscription Request Received',
    'Your subscription request has been received and is pending approval.'
  );

  // 8. Log activity (System action for now)
  await supabase.from('activity_logs').insert([{
    actor_id: userId,
    actor_type: 'user',
    action: 'created_subscription',
    entity_type: 'subscription',
    entity_id: subscription.id,
  }]);

  return subscription;
};

export const getMySubscriptions = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      subscription_plans (*),
      addresses (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Failed to fetch subscriptions');
  return data;
};

export const getSubscriptionById = async (userId: string, subscriptionId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      subscription_plans (*),
      addresses (*),
      subscription_items (
        *,
        food_items (*)
      )
    `)
    .eq('id', subscriptionId)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Subscription not found');
  return data;
};

export const renewSubscription = async (userId: string, subscriptionId: string) => {
  // Fetch existing
  const existing = await getSubscriptionById(userId, subscriptionId);
  
  if (existing.status !== SUBSCRIPTION_STATUS.COMPLETED && existing.status !== SUBSCRIPTION_STATUS.CANCELLED) {
    throw new Error('Can only renew completed or cancelled subscriptions');
  }

  // Create new payload based on existing
  const payload = {
    plan_id: existing.plan_id,
    address_id: existing.address_id,
    duration_days: existing.duration_days,
    notes: existing.notes,
    items: existing.subscription_items.map((item: any) => ({
      food_item_id: item.food_item_id,
      quantity: item.quantity,
    })),
  };

  return createSubscription(userId, payload);
};
