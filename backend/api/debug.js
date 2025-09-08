module.exports = (req, res) => {
  res.json({
    hasUrl: !!process.env.SUPABASE_URL,
    url: (process.env.SUPABASE_URL || '').slice(0, 30),
    srLen: (process.env.SUPABASE_SERVICE_ROLE || '').length,
    anonLen: (process.env.SUPABASE_ANON_KEY || '').length
  });
};
