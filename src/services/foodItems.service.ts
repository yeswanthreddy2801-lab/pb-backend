import { supabase } from '../config/supabase';

export const getFoodItems = async (filters: any) => {
  let query = supabase.from('food_items').select('id, name, category, planType:plan_type, protein:protein_g, calories, price, imageUrl:image_url, emoji, color, description, isActive:is_active, isAvailable:is_available, sortOrder:sort_order').order('sort_order', { ascending: true });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.planType) {
    // If planType is nonveg, return nonveg and both
    // If planType is veg, return veg and both
    query = query.in('plan_type', [filters.planType, 'both']);
  }
  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive === 'true');
  } else {
    // By default for public users, only show active
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw new Error('Failed to fetch food items');
  return data;
};

export const getFoodItemById = async (id: string) => {
  const { data, error } = await supabase
    .from('food_items')
    .select('id, name, category, planType:plan_type, protein:protein_g, calories, price, imageUrl:image_url, emoji, color, description, isActive:is_active, isAvailable:is_available, sortOrder:sort_order')
    .eq('id', id)
    .single();

  if (error) throw new Error('Food item not found');
  return data;
};

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('id, name, slug, description, category, basePrice:base_price, maxItems:max_items, color, emoji:icon, isActive:is_active')
    .eq('is_active', true);
  if (error) throw new Error('Failed to fetch plans');
  return data;
};
