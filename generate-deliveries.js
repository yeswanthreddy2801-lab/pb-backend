require('dotenv').config({ path: 'c:/Users/Yeswanth Reddy/OneDrive/Desktop/proteinBox/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: subs } = await supabase.from('subscriptions').select('*').eq('status', 'approved');
  
  if (!subs || subs.length === 0) {
    return console.log('No active subscriptions found.');
  }
  
  const today = new Date().toISOString().split('T')[0];
  const payload = subs.map(s => ({
    subscription_id: s.id,
    customer_id: s.user_id,
    address_id: s.address_id || null, // in case it exists
    delivery_date: today,
    delivery_status: 'pending'
  }));
  
  await supabase.from('daily_deliveries').upsert(payload, { onConflict: 'subscription_id,delivery_date' });
  console.log('Successfully generated today\'s deliveries!');
}

run().catch(console.error);
