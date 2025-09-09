// backend/api/contact.js
// Node.js runtime en Vercel, CommonJS con import dinámico para módulos ESM.

// ========= C O N F I G =========
const RESEND_KEY  = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;   // p.ej. 'info@myautoimport.es'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;   // destino de los leads

// Orígenes permitidos (prod + lista CSV opcional)
const PROD_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://my-auto-importfrontend.vercel.app';
const EXTRA_ORIGINS = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ========= C O R S  H E L P E R S =========
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === PROD_ORIGIN) return true;
  if (EXTRA_ORIGINS.includes(origin)) return true;

  // Permite previews de Vercel del frontend:
  // - my-auto-importfrontend-xxxxx-*.vercel.app
  // - my-auto-importfrontend.vercel.app
  try {
    const u = new URL(origin);
    const host = u.hostname;
    const isHttps = u.protocol === 'https:';
    const isPreview =
      host.endsWith('.vercel.app') &&
      (host.startsWith('my-auto-importfrontend-') || host === 'my-auto-importfrontend.vercel.app');
    return isHttps && isPreview;
  } catch {
    return false;
  }
}

function setCors(req, res) {
  const origin = req.headers.origin;
  const allow = isAllowedOrigin(origin) ? origin : PROD_ORIGIN;

  if (allow) res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
}

function json(res, code, payload) {
  res.status(code).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function safeParseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('INVALID_JSON')); }
    });
    req.on('error', reject);
  });
}

// ========= H A N D L E R =========
module.exports = async (req, res) => {
  try {
    setCors(req, res);

    // Preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.method !== 'POST') {
      return json(res, 405, { ok:false, error:'METHOD_NOT_ALLOWED' });
    }

    // Validación de envs para evitar crashes silenciosos
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

    // ESM -> import dinámico (evita ERR_REQUIRE_ESM)
    let Resend;
    try {
      ({ Resend } = await import('resend'));
    } catch (e) {
      return json(res, 500, { ok:false, error:'RESEND_IMPORT_ERROR', details: String((e && e.message) || e) });
    }

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

    // Enviar (probamos reply_to y replyTo para compatibilidad)
    let sendResult;
    try {
      sendResult = await resend.emails.send({
        from: `AutoImport Iberia <${RESEND_FROM}>`,
        to: ADMIN_EMAIL,
        subject,
        text,
        reply_to: email,
        replyTo: email
      });
    } catch (e) {
      return json(res, 502, { ok:false, error:'RESEND_SDK_THROW', details:String((e && e.message) || e) });
    }

    if (sendResult?.error) {
      return json(res, 502, { ok:false, error:'RESEND_ERROR', details: sendResult.error });
    }

    return json(res, 200, { ok:true });
  } catch (err) {
    return json(res, 500, { ok:false, error:'UNEXPECTED_ERROR', details:String((err && err.message) || err) });
  }
};
