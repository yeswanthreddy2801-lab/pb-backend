const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function deactivateOldPlans() {
  const oldSlugs = ['veg-protein', 'fitness-protein', 'nonveg-protein'];
  
  const { data, error } = await supabase
    .from('subscription_plans')
    .update({ is_active: false })
    .in('slug', oldSlugs);

  if (error) {
    console.error('Error deactivating old plans:', error);
  } else {
    console.log('Deactivated old plans!');
  }
}

deactivateOldPlans();
