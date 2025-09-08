// /api/vehicles.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Permite poner tu dominio de frontend en env (recomendado)
// Si no está, caerá a * para no bloquear mientras pruebas.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    // Responder al preflight
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
      // Buscar por make/model
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
