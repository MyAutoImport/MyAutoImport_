const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') { res.status(405).end(); return; }

  const status = (req.query.status || 'available') + '';
  const q = req.query.q ? String(req.query.q) : null;

  let query = supabase.from('vehicles')
    .select('id,make,model,year,price,fuel,mileage,images,status')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (q) query = query.ilike('model', `%${q}%`);

  const { data, error } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(200).json(data);
};
