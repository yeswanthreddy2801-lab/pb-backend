import { supabase } from '../config/supabase';

export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, mobile, name, email, is_active, is_new_user, created_at')
    .eq('id', userId)
    .single();

  if (error) throw new Error('User not found');
  return data;
};

export const updateUserProfile = async (userId: string, payload: { name?: string; email?: string }) => {
  const { data, error } = await supabase
    .from('users')
    .update(payload)
    .eq('id', userId)
    .select('id, mobile, name, email, is_active, is_new_user, created_at')
    .single();

  if (error) throw new Error('Failed to update user profile');
  return data;
};

export const getAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) throw new Error('Failed to fetch addresses');
  return data;
};

export const createAddress = async (userId: string, payload: any) => {
  if (payload.is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert([{ ...payload, user_id: userId }])
    .select('*')
    .single();

  if (error) throw new Error('Failed to create address');
  return data;
};

export const updateAddress = async (userId: string, addressId: string, payload: any) => {
  if (payload.is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(payload)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw new Error('Failed to update address');
  return data;
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) throw new Error('Failed to delete address');
  return true;
};

export const setDefaultAddress = async (userId: string, addressId: string) => {
  await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);

  const { data, error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw new Error('Failed to set default address');
  return data;
};
