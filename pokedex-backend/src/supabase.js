const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  realtime: { transport: ws },
  auth: { persistSession: false }
});

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { transport: ws },
  auth: { persistSession: false }
});

module.exports = { supabaseAdmin, supabaseAnon };
