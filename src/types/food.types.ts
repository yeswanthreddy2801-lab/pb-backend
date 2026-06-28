export interface FoodItem {
  id: string;
  name: string;
  category: string;
  plan_type: string;
  protein_g: number;
  calories: number;
  price: number;
  image_url: string | null;
  emoji: string | null;
  color: string | null;
  description: string | null;
  is_active: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  base_price: number;
  max_items: number;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}
