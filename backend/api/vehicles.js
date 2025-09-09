// backend/api/vehicles.js
const { createClient } = require('@supabase/supabase-js');

/** === ORÍGENES PERMITIDOS === ver arriba en contact.js */
const PROD_ORIGIN = 'https://my-auto-importfrontend.vercel.app';
const PREVIEW_RE  = /^https:\/\/my-auto-importfrontend-[\w-]+-my-auto-imports-projects\.vercel\.app$/;
const LOCAL_SET   = new Set(['http://localhost:3000','http://localhost:5173']);

function pickAllowOrigin(req) {
  const origin = req.headers.origin || '';
  if (origin === PROD_ORIGIN || PREVIEW_RE.test(origin) || LOCAL_SET.has(origin)) {
    return origin;
  }
  return PROD_ORIGIN;
}
function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', pickAllowOrigin(req));
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

module.exports = async (req, res) => {
  setCors(req, res);

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); return; }

  try {
    const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';

    let query = supabase
      .from('vehicles')
      .select('id,make,model,year,price,fuel,mileage,images,status,created_at')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (q) query = query.or(`model.ilike.%${q}%,make.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) { res.status(500).json({ error: error.message }); return; }

    res.status(200).json(data || []);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
};
