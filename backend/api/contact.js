// /api/contact.js  (Vercel – Node, CommonJS)
const { Resend } = require('resend');

const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || 'https://my-auto-importfrontend.vercel.app';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

module.exports = async (req, res) => {
  // CORS: preflight
  if (req.method === 'OPTIONS') {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Validar envs críticas
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }
    if (!process.env.ADMIN_EMAIL) {
      throw new Error('Missing ADMIN_EMAIL');
    }

    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email y message son obligatorios' });
    }

    // Resend: usar SIEMPRE un remitente @myautoimport.es (tu dominio verificado)
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'AutoImport Iberia <no-reply@myautoimport.es>',
      to: process.env.ADMIN_EMAIL,   // tu destino real (puede ser gmail)
      reply_to: email,               // a este se responde
      subject: `Nuevo lead: ${name}`,
      text: [
        `Nombre:  ${name}`,
        `Email:   ${email}`,
        `Teléfono:${phone || '-'}`,
        `Mensaje: ${message}`,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact error:', err);
    // Devuelve mensaje para que lo veas en el Network tab (y cierra bien la lambda)
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
};
