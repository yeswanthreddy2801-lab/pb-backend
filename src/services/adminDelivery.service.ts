import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';

export const getAllDeliveryStaff = async () => {
  const { data, error } = await supabase
    .from('delivery_staff')
    .select('*')
    .order('name');
  if (error) throw new Error('Failed to fetch delivery staff');
  return data;
};

export const createDeliveryStaff = async (staffData: any) => {
  const { name, mobile, password, vehicleNumber } = staffData;
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('delivery_staff')
    .insert([{
      name,
      mobile,
      password_hash: passwordHash,
      vehicle_number: vehicleNumber
    }])
    .select()
    .single();

  if (error) throw new Error('Failed to create delivery staff');
  return data;
};

export const getAllTodayDeliveries = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_deliveries')
    .select(`
      *,
      delivery_staff!daily_deliveries_delivery_boy_id_fkey (name, mobile),
      users (name, mobile),
      addresses (*),
      subscriptions (*, subscription_plans (*))
    `)
    .eq('delivery_date', today)
    .order('time_slot');
  if (error) throw new Error('Failed to fetch all today deliveries');
  return data;
};

export const assignDelivery = async (assignment: any) => {
  const { subscriptionId, deliveryBoyId, deliveryDate, timeSlot, customerId, addressId } = assignment;
  const date = deliveryDate || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_deliveries')
    .upsert(
      {
        delivery_boy_id: deliveryBoyId,
        subscription_id: subscriptionId,
        customer_id: customerId,
        address_id: addressId,
        delivery_date: date,
        time_slot: timeSlot || 'morning_6_8',
        delivery_status: 'pending'
      },
      { onConflict: 'subscription_id,delivery_date' }
    )
    .select()
    .single();

  if (error) throw new Error('Failed to assign delivery');
  return data;
};

export const reassignDelivery = async (deliveryId: string, deliveryBoyId: string) => {
  const { data, error } = await supabase
    .from('daily_deliveries')
    .update({ delivery_boy_id: deliveryBoyId })
    .eq('id', deliveryId)
    .select()
    .single();

  if (error) throw new Error('Failed to reassign delivery');
  return data;
};

export const getDeliveryStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_deliveries')
    .select('delivery_status, delivery_boy_id, delivery_staff!daily_deliveries_delivery_boy_id_fkey(name)')
    .eq('delivery_date', today);

  if (error) throw new Error('Failed to fetch admin delivery stats');

  let totalAssigned = 0, delivered = 0, pending = 0, failed = 0;
  const byDeliveryBoy: any = {};

  data.forEach((d: any) => {
    totalAssigned++;
    if (d.delivery_status === 'delivered') delivered++;
    else if (d.delivery_status === 'failed') failed++;
    else pending++;

    if (d.delivery_boy_id) {
      if (!byDeliveryBoy[d.delivery_boy_id]) {
        byDeliveryBoy[d.delivery_boy_id] = { name: d.delivery_staff?.name, total: 0, delivered: 0 };
      }
      byDeliveryBoy[d.delivery_boy_id].total++;
      if (d.delivery_status === 'delivered') {
        byDeliveryBoy[d.delivery_boy_id].delivered++;
      }
    }
  });

  return { totalAssigned, delivered, pending, failed, byDeliveryBoy: Object.values(byDeliveryBoy) };
};

export const bulkAssignDeliveries = async (bulkData: any) => {
  const { deliveryBoyId, assignments, deliveryDate, timeSlot } = bulkData;
  const date = deliveryDate || new Date().toISOString().split('T')[0];

  const payload = assignments.map((a: any) => ({
    delivery_boy_id: deliveryBoyId,
    subscription_id: a.subscriptionId,
    customer_id: a.customerId,
    address_id: a.addressId,
    delivery_date: date,
    time_slot: timeSlot || 'morning_6_8',
    delivery_status: 'pending'
  }));

  const { data, error } = await supabase
    .from('daily_deliveries')
    .upsert(payload, { onConflict: 'subscription_id,delivery_date' })
    .select();

  if (error) throw new Error('Failed to bulk assign deliveries');
  return data;
};
