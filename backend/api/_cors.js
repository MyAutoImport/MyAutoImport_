// backend/api/_cors.js (CommonJS)
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://my-auto-importfrontend.vercel.app";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24h
}

function handlePreflight(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { setCors, handlePreflight };
