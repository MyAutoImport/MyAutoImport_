const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE
);
const resend = new Resend(process.env.RESEND_API_KEY);

function setCors(req, res) {
  const origin = process.env.FRONTEND_ORIGIN || 'https://my-auto-importfrontend.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCors(req, res);

  if (req.method === 'OPTIONS') { // Preflight
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Faltan campos obligatorios.' });
      return;
    }

    // Guarda el lead
    const { error: dbError } = await supabase.from('leads').insert([{ name, email, phone, message }]);
    if (dbError) throw dbError;

    // Envía email (usa onboarding@resend.dev si tu dominio no está verificado)
    const to = process.env.ADMIN_EMAIL || 'info@myautoimport.es';
    await resend.emails.send({
      from: 'onboarding@resend.dev', // cambia a tu remitente verificado cuando lo tengas
      to,
      subject: 'Nuevo lead de AutoImport Iberia',
      text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '-'}\n\nMensaje:\n${message}`
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Error interno' });
  }
};
