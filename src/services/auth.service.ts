import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateUserToken, generateAdminToken } from '../utils/jwt';

export const loginUser = async (mobile: string, name?: string) => {
  // Check if user exists
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('mobile', mobile)
    .single();

  if (findError && findError.code !== 'PGRST116') {
    throw new Error('Database error while finding user');
  }

  let user = existingUser;
  let isNewUser = false;

  if (!user) {
    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ mobile, name: name || undefined, is_new_user: true }])
      .select('*')
      .single();

    if (createError) {
      throw new Error('Failed to create new user');
    }

    user = newUser;
    isNewUser = true;
  } else {
    // Optionally update is_new_user and name on subsequent logins
    const updates: any = {};
    if (user.is_new_user) updates.is_new_user = false;
    if (name && user.name !== name) updates.name = name;

    if (Object.keys(updates).length > 0) {
      await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);
      isNewUser = false;
      user = { ...user, ...updates };
    }
  }

  const token = generateUserToken({
    userId: user.id,
    mobile: user.mobile,
    isNewUser,
  });

  return { token, isNewUser, user };
};

export const loginAdmin = async (mobile: string, passwordPlain: string) => {
  const { data: admin, error: findError } = await supabase
    .from('admins')
    .select('*')
    .eq('mobile', mobile)
    .single();

  if (findError || !admin) {
    throw new Error('Invalid credentials');
  }

  if (!admin.is_active) {
    throw new Error('Admin account is disabled');
  }

  const isMatch = await bcrypt.compare(passwordPlain, admin.password_hash);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateAdminToken({
    adminId: admin.id,
    mobile: admin.mobile,
  });

  return { token, admin: { id: admin.id, name: admin.name, role: admin.role } };
};

export const changeAdminPassword = async (adminId: string, currentPasswordPlain: string, newPasswordPlain: string) => {
  const { data: admin, error: findError } = await supabase
    .from('admins')
    .select('*')
    .eq('id', adminId)
    .single();

  if (findError || !admin) {
    throw new Error('Admin not found');
  }

  const isMatch = await bcrypt.compare(currentPasswordPlain, admin.password_hash);

  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  const newPasswordHash = await bcrypt.hash(newPasswordPlain, 10);

  const { error: updateError } = await supabase
    .from('admins')
    .update({ password_hash: newPasswordHash })
    .eq('id', adminId);

  if (updateError) {
    throw new Error('Failed to update password');
  }

  return true;
};
