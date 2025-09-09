// backend/api/vehicles.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const PROD_ORIGIN   = process.env.FRONTEND_ORIGIN || 'https://my-auto-importfrontend.vercel.app';
const EXTRA_ORIGINS = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function pickAllowedOrigin(origin) {
  try {
    if (!origin) return PROD_ORIGIN;
    if (origin === PROD_ORIGIN) return origin;
    if (EXTRA_ORIGINS.includes(origin)) return origin;
    const previewRE = /^https:\/\/my-auto-importfrontend(?:-[a-z0-9-]+)?\.vercel\.app$/i;
    if (previewRE.test(origin)) return origin;
    return PROD_ORIGIN;
  } catch {
    return PROD_ORIGIN;
  }
}

function setCors(req, res) {
  try {
    const allow = pickAllowedOrigin(req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', allow);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } catch {
    res.setHeader('Access-Control-Allow-Origin', PROD_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }
}

module.exports = async (req, res) => {
  setCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';

    let query = supabase
      .from('vehicles')
      .select('id,make,model,year,price,fuel,mileage,images,status')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`model.ilike.%${q}%,make.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected error' });
  }
};
