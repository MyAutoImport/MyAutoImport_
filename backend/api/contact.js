// backend/api/contact.js
// Node.js runtime en Vercel, CommonJS con import dinámico para módulos ESM.

// ====== ENV ======
const RESEND_KEY  = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;   // p.ej. 'info@myautoimport.es'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;   // destino de los leads

const PROD_ORIGIN   = process.env.FRONTEND_ORIGIN || 'https://my-auto-importfrontend.vercel.app';
const EXTRA_ORIGINS = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ====== CORS helper (sin throws, nunca rompe) ======
function pickAllowedOrigin(origin) {
  try {
    if (!origin) return PROD_ORIGIN;

    // Prod exacto
    if (origin === PROD_ORIGIN) return origin;

    // Lista blanca adicional (CSV)
    if (EXTRA_ORIGINS.includes(origin)) return origin;

    // Previews de Vercel del frontend
    //   https://my-auto-importfrontend-xxxxx-projects.vercel.app
    //   https://my-auto-importfrontend.vercel.app
    const previewRE = /^https:\/\/my-auto-importfrontend(?:-[a-z0-9-]+)?\.vercel\.app$/i;
    if (previewRE.test(origin)) return origin;

    // Fallback: prod (para evitar 403 CORS)
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } catch {
    // Aún en caso extremo, devolvemos algo válido
    res.setHeader('Access-Control-Allow-Origin', PROD_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  }
}

function json(res, code, payload) {
  res.status(code).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function safeParseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => (raw += c));
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('INVALID_JSON')); }
    });
    req.on('error', reject);
  });
}

// ====== Handler ======
module.exports = async (req, res) => {
  setCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  // Validación de envs (sin crashear)
  if (!RESEND_KEY || !RESEND_FROM || !ADMIN_EMAIL) {
    return json(res, 500, {
      ok: false,
      error: 'CONFIG_ERROR',
      details: {
        RESEND_API_KEY: !!RESEND_KEY,
        RESEND_FROM: !!RESEND_FROM,
        ADMIN_EMAIL: !!ADMIN_EMAIL
      }
    });
  }

  // Import dinámico ESM (resend)
  let Resend;
  try {
    ({ Resend } = await import('resend'));
  } catch (e) {
    return json(res, 500, { ok:false, error:'RESEND_IMPORT_ERROR', details: String((e && e.message) || e) });
  }

  // Body
  let body;
  try {
    body = await safeParseBody(req);
  } catch {
    return json(res, 400, { ok:false, error:'INVALID_JSON' });
  }

  const name    = String(body.name || '').trim();
  const email   = String(body.email || '').trim();
  const phone   = String(body.phone || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return json(res, 400, { ok:false, error:'VALIDATION_ERROR', details:{ required:['name','email','message'] } });
  }

  const resend = new Resend(RESEND_KEY);

  const subject = `Nuevo contacto de ${name}`;
  const text = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    phone ? `Teléfono: ${phone}` : null,
    `Mensaje:`,
    message
  ].filter(Boolean).join('\n');

  try {
    const result = await resend.emails.send({
      from: `AutoImport Iberia <${RESEND_FROM}>`,
      to: ADMIN_EMAIL,
      subject,
      text,
      reply_to: email, // REST/SDK modernos
      replyTo: email   // fallback
    });

    if (result?.error) {
      return json(res, 502, { ok:false, error:'RESEND_ERROR', details: result.error });
    }
  } catch (e) {
    return json(res, 502, { ok:false, error:'RESEND_SDK_THROW', details:String((e && e.message) || e) });
  }

  return json(res, 200, { ok:true });
};
