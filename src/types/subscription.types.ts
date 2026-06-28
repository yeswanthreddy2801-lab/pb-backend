export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  address_id: string;
  status: string;
  total_price: number;
  total_protein: number | null;
  total_calories: number | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number;
  notes: string | null;
  submitted_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  food_item_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}
