"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddresses = exports.updateUserProfile = exports.getUserById = void 0;
const supabase_1 = require("../config/supabase");
const getUserById = async (userId) => {
    const { data, error } = await supabase_1.supabase
        .from('users')
        .select('id, mobile, name, email, is_active, is_new_user, created_at')
        .eq('id', userId)
        .single();
    if (error)
        throw new Error('User not found');
    return data;
};
exports.getUserById = getUserById;
const updateUserProfile = async (userId, payload) => {
    const { data, error } = await supabase_1.supabase
        .from('users')
        .update(payload)
        .eq('id', userId)
        .select('id, mobile, name, email, is_active, is_new_user, created_at')
        .single();
    if (error)
        throw new Error('Failed to update user profile');
    return data;
};
exports.updateUserProfile = updateUserProfile;
const getAddresses = async (userId) => {
    const { data, error } = await supabase_1.supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });
    if (error)
        throw new Error('Failed to fetch addresses');
    return data;
};
exports.getAddresses = getAddresses;
const createAddress = async (userId, payload) => {
    if (payload.is_default) {
        await supabase_1.supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    }
    const { data, error } = await supabase_1.supabase
        .from('addresses')
        .insert([{ ...payload, user_id: userId }])
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to create address');
    return data;
};
exports.createAddress = createAddress;
const updateAddress = async (userId, addressId, payload) => {
    if (payload.is_default) {
        await supabase_1.supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    }
    const { data, error } = await supabase_1.supabase
        .from('addresses')
        .update(payload)
        .eq('id', addressId)
        .eq('user_id', userId)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to update address');
    return data;
};
exports.updateAddress = updateAddress;
const deleteAddress = async (userId, addressId) => {
    const { error } = await supabase_1.supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);
    if (error)
        throw new Error('Failed to delete address');
    return true;
};
exports.deleteAddress = deleteAddress;
const setDefaultAddress = async (userId, addressId) => {
    await supabase_1.supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    const { data, error } = await supabase_1.supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select('*')
        .single();
    if (error)
        throw new Error('Failed to set default address');
    return data;
};
exports.setDefaultAddress = setDefaultAddress;
