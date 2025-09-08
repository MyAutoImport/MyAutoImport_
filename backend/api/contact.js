// backend/api/contact.js (CommonJS)
const { Resend } = require("resend");
const { createClient } = require("@supabase/supabase-js");
const { setCors, handlePreflight } = require("./_cors");

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@autoimportiberia.es";

// Para guardar leads opcionalmente:
const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE)
    : null;

module.exports = async (req, res) => {
  // Preflight
  if (handlePreflight(req, res)) return;

  setCors(res);

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // 1) Guardar lead (opcional; ignora errores)
    if (supabase) {
      await supabase
        .from("leads")
        .insert([
          {
            name,
            email,
            phone: phone || null,
            message,
            source: "website",
            created_at: new Date().toISOString()
          }
        ]);
    }

    // 2) Enviar email con Resend
    await resend.emails.send({
      from: "MyAutoImport <onboarding@resend.dev>", // tu sender verificado si lo tienes
      to: [ADMIN_EMAIL],
      subject: "Nuevo lead desde la web",
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Teléfono: ${phone || "-"}`,
        "",
        `Mensaje:`,
        message
      ].join("\n")
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};
