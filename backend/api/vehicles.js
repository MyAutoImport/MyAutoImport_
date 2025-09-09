// backend/api/vehicles.js
// Lista vehículos desde Supabase con CORS sólido.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL   = process.env.SUPABASE_URL;
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY; // usa ANON si quieres solo lectura

const PROD_ORIGIN    = process.env.FRONTEND_ORIGIN || '';
const PREVIEW_PREFIX = process.env.FRONTEND_PREVIEW_PREFIX || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (PROD_ORIGIN && origin === PROD_ORIGIN) return true;
  if (PREVIEW_PREFIX && origin.startsWith(PREVIEW_PREFIX) && origin.endsWith('.vercel.app')) return true;
  if (origin === 'http://localhost:3000' || origin === 'http://localhost:5173') return true;
  return false;
}

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (PROD_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', PROD_ORIGIN);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
}

module.exports = async (req, res) => {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }));
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'CONFIG_ERROR' }));
  }

  try {
    const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';

    let query = supabase
      .from('vehicles')
      .select('id,make,model,year,price,fuel,mileage,images,status,location,transmission')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`model.ilike.%${q}%,make.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: error.message }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data || []));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: err?.message || 'Unexpected error' }));
  }
};
