const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

supabase.from('daily_deliveries').select(`
      *,
      delivery_staff!daily_deliveries_delivery_boy_id_fkey (name, mobile),
      addresses (*),
      subscriptions (
        *,
        subscription_plans (*)
      )
    `).limit(1).maybeSingle().then(res => console.log(JSON.stringify(res, null, 2))).catch(console.error);
