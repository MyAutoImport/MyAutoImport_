// backend/api/contact.js
// CommonJS + Node runtime en Vercel

const { Resend } = require('resend')

// ====== C O N F I G ======
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || '*' // mejor poner tu frontend exacto en Vercel
const RESEND_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM // p.ej. 'info@myautoimport.es'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL // a dónde recibes los leads

// ====== H E L P E R S ======
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
}

function json(res, code, payload) {
  res.status(code).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function safeParseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch (e) {
        reject(new Error('INVALID_JSON'))
      }
    })
    req.on('error', reject)
  })
}

// ====== H A N D L E R ======
module.exports = async (req, res) => {
  try {
    setCors(res)

    // Preflight CORS
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      return res.end()
    }

    if (req.method !== 'POST') {
      return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' })
    }

    // Validación de configuración (evitamos crashear)
    if (!RESEND_KEY || !RESEND_FROM || !ADMIN_EMAIL) {
      return json(res, 500, {
        ok: false,
        error: 'CONFIG_ERROR',
        details: {
          missing: {
            RESEND_API_KEY: !!RESEND_KEY,
            RESEND_FROM: !!RESEND_FROM,
            ADMIN_EMAIL: !!ADMIN_EMAIL,
          },
        },
      })
    }

    // Body
    let body
    try {
      body = await safeParseBody(req)
    } catch (e) {
      return json(res, 400, { ok: false, error: 'INVALID_JSON' })
    }

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const message = String(body.message || '').trim()

    if (!name || !email || !message) {
      return json(res, 400, {
        ok: false,
        error: 'VALIDATION_ERROR',
        details: { required: ['name', 'email', 'message'] },
      })
    }

    // Envío con Resend
    const resend = new Resend(RESEND_KEY)

    const subject = `Nuevo contacto de ${name}`
    const text = [
      `Nombre: ${name}`,
      `Email: ${email}`,
      phone ? `Teléfono: ${phone}` : null,
      `Mensaje:`,
      message,
    ]
      .filter(Boolean)
      .join('\n')

    // Sencillo: envía un texto plano (evita problemas de HTML)
    const { error } = await resend.emails.send({
      from: `AutoImport Iberia <${RESEND_FROM}>`,
      to: ADMIN_EMAIL,
      reply_to: email,
      subject,
      text,
    })

    if (error) {
      // No crasheamos: devolvemos error controlado
      return json(res, 502, { ok: false, error: 'RESEND_ERROR', details: error })
    }

    return json(res, 200, { ok: true })
  } catch (err) {
    // Nada de throw sin control
    return json(res, 500, { ok: false, error: 'UNEXPECTED_ERROR' })
  }
}
