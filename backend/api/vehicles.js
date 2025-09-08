const { createClient } = require('@supabase/supabase-js');

const allowOrigin =
  process.env.CORS_ALLOW_ORIGIN || 'https://my-auto-importfrontend.vercel.app';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const q = (req.query.q || '').toString().trim();
    let query = supabase
      .from('vehicles')
      .select('id,make,model,year,price,fuel,mileage,images,status')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (q) query = query.ilike('model', `%${q}%`);

    const { data, error } = await query;
    if (error) throw error;

    // (Opcional) cache corto en CDN
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
