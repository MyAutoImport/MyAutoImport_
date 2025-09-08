const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  // Para lectura vale el anon; si faltara, usa la service role.
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE
);

function setCors(req, res) {
  const origin = process.env.FRONTEND_ORIGIN || 'https://my-auto-importfrontend.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCors(req, res);

  if (req.method === 'OPTIONS') { // Preflight
    res.status(200).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const status = (req.query.status || 'available').toString();
  const q = (req.query.q || '').toString();

  let query = supabase
    .from('vehicles')
    .select('id,make,model,year,price,fuel,mileage,images,status')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (q) query = query.ilike('model', `%${q}%`);

  const { data, error } = await query;
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
  res.status(200).json(data || []);
};
