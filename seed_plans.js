const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const plans = [
  {
    name: 'Veg Protein Box',
    slug: 'veg-protein-box',
    description: 'Healthy vegetarian breakfast with balanced protein every day.',
    category: 'veg',
    base_price: 999,
    max_items: 6,
    icon: '🥗',
    color: '#16A34A',
    is_active: true
  },
  {
    name: 'Egg Protein Box',
    slug: 'egg-protein-box',
    description: 'High-protein breakfast powered by eggs and wholesome ingredients.',
    category: 'egg',
    base_price: 1299,
    max_items: 6,
    icon: '🍳',
    color: '#EAB308',
    is_active: true
  },
  {
    name: 'High Protein Fitness Box',
    slug: 'high-protein-fitness-box',
    description: 'Designed for muscle recovery, strength, and active lifestyles.',
    category: 'non-veg',
    base_price: 1799,
    max_items: 6,
    icon: '💪',
    color: '#EF4444',
    is_active: true
  }
];

async function seedPlans() {
  console.log('Seeding plans...');
  
  // Optionally, you can delete existing plans first or just add these
  // Let's just upsert based on slug if possible, but there's no unique constraint on slug by default maybe?
  // We'll just delete all existing plans for a clean slate as requested (3 plans are enough)
  
  const { error: deleteError } = await supabase
    .from('subscription_plans')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all

  if (deleteError) {
    console.error('Error deleting old plans:', deleteError);
  } else {
    console.log('Cleared old plans.');
  }

  const { data, error } = await supabase
    .from('subscription_plans')
    .insert(plans);

  if (error) {
    console.error('Error inserting plans:', error);
  } else {
    console.log('Successfully inserted plans!');
  }
}

seedPlans();
