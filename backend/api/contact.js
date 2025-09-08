// backend/api/contact.js
const { Resend } = require('resend');

const ALLOW_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'https://my-auto-importfrontend.vercel.app';

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (name, email, message).' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL    = process.env.ADMIN_EMAIL; // destinatario
    const RESEND_FROM    =
      process.env.RESEND_FROM || 'AutoImport Iberia <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      console.error('Falta RESEND_API_KEY');
      return res.status(500).json({ error: 'Email service no configurado.' });
    }
    if (!ADMIN_EMAIL) {
      console.error('Falta ADMIN_EMAIL');
      return res.status(500).json({ error: 'Destinatario no configurado.' });
    }

    const resend = new Resend(RESEND_API_KEY);

    const subject = `Nuevo lead de la web: ${name}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto">
        <h2>Nuevo lead</h2>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${phone || '-'}</p>
        <p><b>Mensaje:</b></p>
        <pre style="white-space:pre-wrap">${message}</pre>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: RESEND_FROM,     // usa onboarding@resend.dev si no tienes dominio verificado
      to: ADMIN_EMAIL,
      reply_to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'No se pudo enviar el email.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
};
