export interface User {
  id: string;
  mobile: string;
  name: string | null;
  email: string | null;
  is_active: boolean;
  is_new_user: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address: string;
  landmark: string | null;
  pincode: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at: string;
}
