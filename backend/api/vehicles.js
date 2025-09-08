// backend/api/vehicles.js (CommonJS)
const { createClient } = require("@supabase/supabase-js");
const { setCors, handlePreflight } = require("./_cors");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // Preflight
  if (handlePreflight(req, res)) return;

  setCors(res);

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const q = typeof req.query?.q === "string" ? req.query.q : null;

    let query = supabase
      .from("vehicles")
      .select("id,make,model,year,price,fuel,mileage,images,status")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.ilike("model", `%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};
