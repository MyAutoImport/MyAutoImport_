const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

const allowOrigin =
  process.env.CORS_ALLOW_ORIGIN || 'https://my-auto-importfrontend.vercel.app';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Configura estos dos en Vercel (backend):
// - ADMIN_EMAIL (a dónde quieres que llegue el aviso)
// - RESEND_FROM   (direccion remitente verificada en Resend, p.ej. no-reply@tu-dominio)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const RESEND_FROM = process.env.RESEND_FROM || `no-reply@${Date.now()}.example`;

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Guarda lead en Supabase (tabla "leads")
    await supabase.from('leads').insert({
      name,
      email,
      phone: phone || null,
      message,
      created_at: new Date().toISOString()
    });

    // Envía email con Resend
    await resend.emails.send({
      from: RESEND_FROM,
      to: ADMIN_EMAIL,
      subject: 'Nuevo lead (AutoImport Iberia)',
      text: `Nombre: ${name}\nEmail: ${email}\nTel: ${phone || '-'}\n\nMensaje:\n${message}`
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    // Log mínimo sin filtrar credenciales
    res.status(500).json({ error: 'No se pudo enviar el formulario.' });
  }
};
