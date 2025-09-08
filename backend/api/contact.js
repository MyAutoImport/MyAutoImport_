const { Resend } = require('resend');
const { setCors, handlePreflight } = require('./_cors');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (handlePreflight(req, res)) return;

  setCors(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { name = '', email = '', phone = '', message = '' } = req.body || {};

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    // 1) (opcional) Persistir lead en tu BBDD si quieres, p.e. tabla "leads"
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
    // await supabase.from('leads').insert({ name, email, phone, message });

    // 2) Enviar email con Resend
    const toEmail = process.env.ADMIN_EMAIL || 'info@autoi...'; // tu email destino
    const subject = `Nuevo lead de ${name}`;
    const html = `
      <h2>Nuevo contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || '-'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${(message || '').replace(/\n/g, '<br>')}</p>
    `;

    const { error: mailError } = await resend.emails.send({
      from: 'Autolimport Iberia <noreply@autoi.mydomain>', // configura tu dominio verificado en Resend
      to: [toEmail],
      reply_to: email,
      subject,
      html
    });

    if (mailError) {
      res.status(500).json({ error: mailError.message || 'Error enviando email' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected error' });
  }
};
