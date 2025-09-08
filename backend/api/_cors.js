// backend/api/_cors.js
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(204).end(); // No Content
    return true;
  }
  return false;
}

module.exports = { setCors, handlePreflight };
