// backend/api/contact.js
// Node.js runtime (CommonJS) + import dinámico para ESM del SDK de Resend.

const PROD_ORIGIN = process.env.FRONTEND_ORIGIN || '';
const PREVIEW_PREFIX = process.env.FRONTEND_PREVIEW_PREFIX || ''; // p.ej. "https://my-auto-importfrontend-"
const RESEND_KEY  = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (PROD_ORIGIN && origin === PROD_ORIGIN) return true;
  if (PREVIEW_PREFIX && origin.startsWith(PREVIEW_PREFIX) && origin.endsWith('.vercel.app')) return true;
  if (origin === 'http://localhost:3000' || origin === 'http://localhost:5173') return true;
  return false;
}

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (PROD_ORIGIN) {
    // Si no coincide, no exponemos wildcard (más seguro). Aun así respondemos al preflight.
    res.setHeader('Access-Control-Allow-Origin', PROD_ORIGIN);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
}

function json(res, code, payload) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
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

module.exports = async (req, res) => {
  try {
    setCors(req, res);

    // Preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.method !== 'POST') {
      return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
    }

    // Validación de config
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

    // Import ESM del SDK
    let Resend;
    try {
      ({ Resend } = await import('resend'));
    } catch (e) {
      return json(res, 500, { ok: false, error: 'RESEND_IMPORT_ERROR', details: String(e && e.message || e) });
    }

    let body;
    try {
      body = await parseBody(req);
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
      '',
      'Mensaje:',
      message
    ].filter(Boolean).join('\n');

    let sendResult;
    try {
      sendResult = await resend.emails.send({
        from: `AutoImport Iberia <${RESEND_FROM}>`,
        to: ADMIN_EMAIL,
        subject,
        text,
        // Compatibilidad segun versión del SDK:
        reply_to: email,
        replyTo: email
      });
    } catch (e) {
      return json(res, 502, { ok:false, error:'RESEND_SDK_THROW', details:String(e && e.message || e) });
    }

    if (sendResult?.error) {
      return json(res, 502, { ok:false, error:'RESEND_ERROR', details: sendResult.error });
    }

    return json(res, 200, { ok: true });
  } catch (err) {
    return json(res, 500, { ok:false, error:'UNEXPECTED_ERROR', details:String(err && err.message || err) });
  }
};
