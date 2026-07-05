import { supabase } from '../config/supabase';
import { DeliveryStatus } from '../types/delivery.types';
import { createNotification } from './notifications.service';

export const getTodayDeliveries = async (deliveryBoyId: string) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_deliveries')
    .select(`
      *,
      users (name, mobile),
      addresses (*),
      subscriptions (
        *,
        subscription_plans (*),
        subscription_items (
          *,
          food_items (*)
        )
      )
    `)
    .eq('delivery_boy_id', deliveryBoyId)
    .eq('delivery_date', today)
    .order('time_slot', { ascending: true });
    
  if (error) {
    throw new Error('Failed to fetch today\'s deliveries');
  }

  // Client side sorts by status (pending first) or we can sort here if needed
  // Since we ordered by time_slot, we'll sort the resulting array in JS
  const sortedData = data.sort((a, b) => {
    const statusOrder: Record<string, number> = {
      'pending': 1,
      'out_for_delivery': 2,
      'delivered': 3,
      'failed': 4,
      'cancelled': 5
    };
    return (statusOrder[a.delivery_status] || 99) - (statusOrder[b.delivery_status] || 99);
  });

  return sortedData;
};

export const getMyTodayDelivery = async (customerId: string) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_deliveries')
    .select(`
      *,
      delivery_staff!daily_deliveries_delivery_boy_id_fkey (name, mobile),
      addresses (*),
      subscriptions (
        *,
        subscription_plans (*)
      )
    `)
    .eq('customer_id', customerId)
    .eq('delivery_date', today)
    .limit(1)
    .maybeSingle();
    
  if (error) {
    console.error("getMyTodayDelivery supabase error:", error);
    throw new Error('Failed to fetch today\'s delivery');
  }

  return data;
};

export const getPendingDeliveries = async (deliveryBoyId: string) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_deliveries')
    .select(`
      *,
      users (name, mobile),
      addresses (*),
      subscriptions (
        *,
        subscription_plans (*),
        subscription_items (
          *,
          food_items (*)
        )
      )
    `)
    .eq('delivery_boy_id', deliveryBoyId)
    .eq('delivery_date', today)
    .in('delivery_status', ['pending', 'out_for_delivery'])
    .order('time_slot', { ascending: true });
    
  if (error) {
    throw new Error('Failed to fetch pending deliveries');
  }

  return data;
};

export const getCompletedDeliveries = async (deliveryBoyId: string, date?: string) => {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_deliveries')
    .select(`
      *,
      users (name, mobile),
      addresses (*),
      subscriptions (
        *,
        subscription_plans (*),
        subscription_items (
          *,
          food_items (*)
        )
      )
    `)
    .eq('delivery_boy_id', deliveryBoyId)
    .eq('delivery_date', targetDate)
    .eq('delivery_status', 'delivered')
    .order('delivered_at', { ascending: false });
    
  if (error) {
    throw new Error('Failed to fetch completed deliveries');
  }

  return data;
};

export const getDeliveryStats = async (deliveryBoyId: string) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_deliveries')
    .select('delivery_status')
    .eq('delivery_boy_id', deliveryBoyId)
    .eq('delivery_date', today);

  if (error) {
    throw new Error('Failed to fetch delivery stats');
  }

  let total = 0, pending = 0, outForDelivery = 0, delivered = 0, failed = 0;

  data.forEach(d => {
    total++;
    if (d.delivery_status === 'pending') pending++;
    else if (d.delivery_status === 'out_for_delivery') outForDelivery++;
    else if (d.delivery_status === 'delivered') delivered++;
    else if (d.delivery_status === 'failed') failed++;
  });

  return { total, pending, outForDelivery, delivered, failed };
};

export const getDeliveryDetails = async (deliveryId: string, deliveryBoyId: string) => {
  const { data, error } = await supabase
    .from('daily_deliveries')
    .select(`
      *,
      users (name, mobile),
      addresses (*),
      subscriptions (
        *,
        subscription_plans (*),
        subscription_items (
          *,
          food_items (*)
        )
      )
    `)
    .eq('id', deliveryId)
    .eq('delivery_boy_id', deliveryBoyId)
    .single();

  if (error || !data) {
    throw new Error('Delivery not found or unauthorized');
  }

  return data;
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  deliveryBoyId: string,
  status: DeliveryStatus,
  failedReason?: string
) => {
  // 1. Check record exists and belongs to this delivery boy
  const delivery = await getDeliveryDetails(deliveryId, deliveryBoyId);

  // 2. Check not already delivered
  if (delivery.delivery_status === 'delivered') {
    throw new Error('Already marked as delivered');
  }

  const updates: any = {
    delivery_status: status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'delivered') {
    updates.delivered_at = new Date().toISOString();
    updates.delivered_by = deliveryBoyId;
  } else if (status === 'failed') {
    updates.failed_reason = failedReason;
  }

  // 3. Update status
  const { data: updatedDelivery, error } = await supabase
    .from('daily_deliveries')
    .update(updates)
    .eq('id', deliveryId)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update delivery status');
  }

  // 4. If delivered, copy to history
  if (status === 'delivered') {
    const foodItems = delivery.subscriptions?.subscription_items?.map((item: any) => ({
      name: item.food_items.name,
      emoji: item.food_items.emoji,
      protein: item.food_items.protein_g
    }));

    await supabase.from('delivery_history').insert([{
      daily_delivery_id: delivery.id,
      delivery_boy_id: deliveryBoyId,
      customer_id: delivery.customer_id,
      subscription_id: delivery.subscription_id,
      delivery_date: delivery.delivery_date,
      delivered_at: updates.delivered_at,
      status: 'delivered',
      items_delivered: foodItems,
      address_snapshot: delivery.addresses,
      notes: delivery.delivery_notes
    }]);

    // 5. Create customer notification
    await createNotification(
      delivery.customer_id,
      'delivery_completed',
      'Breakfast delivered successfully! ✅',
      'Your ProteinBox breakfast has been delivered.',
      { deliveryId }
    );
  } else if (status === 'out_for_delivery') {
    await createNotification(
      delivery.customer_id,
      'out_for_delivery',
      'Your breakfast is on the way! 🚴',
      'Your ProteinBox breakfast is out for delivery and will arrive soon.',
      { deliveryId }
    );
  } else if (status === 'failed') {
    await createNotification(
      delivery.customer_id,
      'delivery_failed',
      'Delivery attempt failed. We\'ll retry. ❌',
      failedReason || 'Our delivery partner couldn\'t deliver your box.',
      { deliveryId }
    );
  }

  // 6. Log to activity logs
  await supabase.from('activity_logs').insert([{
    actor_id: deliveryBoyId,
    actor_type: 'delivery_boy',
    action: `delivery_marked_${status}`,
    entity_type: 'daily_delivery',
    entity_id: deliveryId,
    metadata: { status, failedReason }
  }]);

  // 7. Return updated
  return updatedDelivery;
};

export const markOutForDelivery = async (deliveryId: string, deliveryBoyId: string) => {
  return updateDeliveryStatus(deliveryId, deliveryBoyId, 'out_for_delivery');
};
