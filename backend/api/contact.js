const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN = process.env.ADMIN_EMAIL || 'admin@myautoimport.es';

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const { name, email, phone = '', message = '', vehicleId = null } = req.body || {};
  if (!name || !email) { res.status(400).json({ error: 'name y email obligatorios' }); return; }

  const { error } = await supabase.from('leads').insert([{ name, email, phone, message, vehicle_id: vehicleId }]);
  if (error) { res.status(500).json({ error: error.message }); return; }

  try {
    await resend.emails.send({
      from: 'Autoimport <admin@myautoimport.es>',
      to: [ADMIN],
      subject: 'Nuevo lead',
      text: `Nombre: ${name}\nEmail: ${email}\nTel: ${phone}\nVehículo: ${vehicleId}\nMensaje:\n${message}`
    });
    await resend.emails.send({
      from: 'Autoimport <info@myautoimport.es>',
      to: [email],
      subject: 'Recibimos tu solicitud',
      text: `Hola ${name}, gracias por contactarnos. Te responderemos pronto.`
    });
  } catch (_) { /* no bloquea la respuesta si falla el correo */ }

  res.status(200).json({ ok: true });
};
