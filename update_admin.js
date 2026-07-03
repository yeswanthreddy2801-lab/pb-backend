const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('admins')
    .update({ mobile: '8297364002' })
    .neq('id', '00000000-0000-0000-0000-000000000000') // just to affect all admins or the main one
    .select();

  if (error) {
    console.error('Error updating admin:', error);
  } else {
    console.log('Admin updated:', data);
  }
}

main();
