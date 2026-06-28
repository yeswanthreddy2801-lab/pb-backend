import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// We use the service role key to bypass RLS in the backend
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
