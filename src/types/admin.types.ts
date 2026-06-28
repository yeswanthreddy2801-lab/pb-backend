export interface Admin {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  actor_id: string;
  actor_type: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: any | null;
  created_at: string;
}

export interface AdminStats {
  pendingCount: number;
  activeCount: number;
  expiringThisWeek: number;
  todayDeliveries: number;
  monthlyRevenue: number;
  totalCustomers: number;
}
