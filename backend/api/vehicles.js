const { createClient } = require('@supabase/supabase-js');
const { setCors, handlePreflight } = require('./_cors');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // para lectura pública basta el anon
);

module.exports = async (req, res) => {
  if (handlePreflight(req, res)) return;

  setCors(res);

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const q = (req.query.q || '').toString();
  const id = (req.query.id || '').toString();

  try {
    let query = supabase
      .from('vehicles')
      .select('id,make,model,year,price,fuel,mileage,images,status,created_at');

    if (id) {
      // Un único coche por UUID
      const { data, error } = await query.eq('id', id).limit(1).maybeSingle();
      if (error) throw error;
      res.status(200).json(data || null);
      return;
    }

    // Listado filtrado
    query = query.eq('status', 'available').order('created_at', { ascending: false });

    if (q) {
      query = query.ilike('model', `%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected error' });
  }
};
