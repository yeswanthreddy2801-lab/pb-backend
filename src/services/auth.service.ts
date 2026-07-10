import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateUserToken, generateAdminToken } from '../utils/jwt';

export const checkUserExists = async (mobile: string) => {
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('mobile', mobile)
    .single();

  if (admin) {
    return { isAdmin: true, exists: false, hasPassword: false };
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, password_hash')
    .eq('mobile', mobile)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new Error('Database error while checking user');
  }

  return {
    isAdmin: false,
    exists: !!user,
    hasPassword: !!(user && user.password_hash)
  };
};

export const loginUser = async (mobile: string, name?: string, passwordPlain?: string) => {
  if (!passwordPlain) throw new Error('Password is required');

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
    const password_hash = await bcrypt.hash(passwordPlain, 10);
    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ mobile, name: name || undefined, is_new_user: true, password_hash }])
      .select('*')
      .single();

    if (createError) {
      throw new Error('Failed to create new user');
    }

    user = newUser;
    isNewUser = true;
  } else {
    if (user.password_hash) {
      // User has password, check it
      const isMatch = await bcrypt.compare(passwordPlain, user.password_hash);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
    } else {
      // Existing user without password, set it up
      const password_hash = await bcrypt.hash(passwordPlain, 10);
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash })
        .eq('id', user.id);
      if (updateError) throw new Error('Failed to set password');
      user.password_hash = password_hash;
    }

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
