const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*');

  if (error) {
    console.error('Error fetching plans:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkPlans();
