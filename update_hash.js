const bcrypt = require('bcryptjs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const hash = bcrypt.hashSync('Admin@1234', 10);
console.log('NEW HASH:', hash);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('admins').update({ password_hash: hash }).eq('mobile', '8297364002')
  .then(({ error }) => {
    if (error) console.error(error);
    else console.log('Password reset with bcryptjs hash!');
  });
