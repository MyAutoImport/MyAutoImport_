// /api/contact.js
const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    // Preflight OK (sin body)
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Faltan campos obligatorios (name, email, message)' });
      return;
    }

    // 1) Guardar lead en Supabase
    const { error: dbError } = await supabase.from('leads').insert([
      {
        name,
        email,
        phone: phone || null,
        message,
        source: 'web',
      },
    ]);

    if (dbError) {
      res.status(500).json({ error: dbError.message });
      return;
    }

    // 2) Enviar aviso por email (usa onboarding@resend.dev si tu dominio no está verificado)
    const toEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.RESEND_FROM || 'onboarding@resend.dev';

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Nuevo lead desde la web',
      text: [
        'Tienes un nuevo lead:',
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Teléfono: ${phone || '-'}`,
        '',
        'Mensaje:',
        message,
      ].join('\n'),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected error' });
  }
};
