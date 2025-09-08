import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

const API_BASE = (process.env.REACT_APP_API_BASE || "").replace(/\/$/, "");

const initialForm = { name: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // Intenta leer mensaje del backend si existe
        let msg = `Error ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {}
        throw new Error(msg);
      }

      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setErrMsg("Error al enviar. Intenta de nuevo.");
      toast.error("No se pudo enviar el formulario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="name"
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={onChange}
          required
          className="border-slate-300 focus:border-slate-500"
        />
        <Input
          name="email"
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={onChange}
          required
          className="border-slate-300 focus:border-slate-500"
        />
      </div>

      <Input
        name="phone"
        type="tel"
        placeholder="Teléfono"
        value={form.phone}
        onChange={onChange}
        className="border-slate-300 focus:border-slate-500"
      />

      <Textarea
        name="message"
        placeholder="Cuéntanos qué vehículo buscas…"
        value={form.message}
        onChange={onChange}
        required
        rows={4}
        className="border-slate-300 focus:border-slate-500"
      />

      {errMsg && (
        <p className="text-sm text-red-600 -mt-2">{errMsg}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3"
      >
        {loading ? "Enviando…" : "Enviar"}
      </Button>
    </form>
  );
}
