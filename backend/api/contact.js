// backend/api/contact.js
// Node.js (CommonJS) + import ESM dinámico para 'resend'

/** === ORÍGENES PERMITIDOS ===
 * Producción:   https://my-auto-importfrontend.vercel.app
 * Previews:     https://my-auto-importfrontend-<hash>-my-auto-imports-projects.vercel.app
 * Local:        http://localhost:3000 / 5173
 */
const PROD_ORIGIN = 'https://my-auto-importfrontend.vercel.app';
const PREVIEW_RE  = /^https:\/\/my-auto-importfrontend-[\w-]+-my-auto-imports-projects\.vercel\.app$/;
const LOCAL_SET   = new Set(['http://localhost:3000','http://localhost:5173']);

const RESEND_KEY  = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;     // p.ej. info@myautoimport.es
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;     // destino de los leads

function pickAllowOrigin(req) {
  const origin = req.headers.origin || '';
  if (origin === PROD_ORIGIN || PREVIEW_RE.test(origin) || LOCAL_SET.has(origin)) {
    return origin; // reflectimos el que viene
  }
  // última red: produc. (evita '*', que rompe credentials en algunos navegadores)
  return PROD_ORIGIN;
}

function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', pickAllowOrigin(req));
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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
    req.on('data', c => (raw += c));
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('INVALID_JSON')); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  try {
    setCors(req, res);

    // Preflight
    if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

    if (req.method !== 'POST') {
      return json(res, 405, { ok:false, error:'METHOD_NOT_ALLOWED' });
    }

    // Validación de configuración
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

    // Import ESM dinámico (evita ERR_REQUIRE_ESM)
    let Resend;
    try { ({ Resend } = await import('resend')); }
    catch (e) {
      return json(res, 500, { ok:false, error:'RESEND_IMPORT_ERROR', details: String(e?.message || e) });
    }

    let body;
    try { body = await safeParseBody(req); }
    catch { return json(res, 400, { ok:false, error:'INVALID_JSON' }); }

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

    let result;
    try {
      result = await resend.emails.send({
        from: `AutoImport Iberia <${RESEND_FROM}>`,
        to: ADMIN_EMAIL,
        subject,
        text,
        reply_to: email, // SDK nuevo
        replyTo:  email  // fallback SDK antiguos
      });
    } catch (e) {
      return json(res, 502, { ok:false, error:'RESEND_SDK_THROW', details:String(e?.message || e) });
    }

    if (result?.error) {
      return json(res, 502, { ok:false, error:'RESEND_ERROR', details: result.error });
    }

    return json(res, 200, { ok:true });
  } catch (err) {
    return json(res, 500, { ok:false, error:'UNEXPECTED_ERROR', details:String(err?.message || err) });
  }
};
