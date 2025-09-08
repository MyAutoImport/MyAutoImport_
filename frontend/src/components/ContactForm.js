import React, { useState } from 'react';
import { submitLead } from '../lib/api';

export default function ContactForm({ vehicleId = null }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'', vehicleId });
  const [status, setStatus] = useState('');

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando…');
    try {
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        vehicleId: form.vehicleId || null,
      });
      setStatus('¡Enviado! Te contactaremos en breve.');
      setForm({ name:'', email:'', phone:'', message:'', vehicleId });
    } catch {
      setStatus('Error al enviar. Intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 max-w-xl">
      <input name="name" value={form.name} onChange={onChange} placeholder="Nombre" required className="border rounded-xl p-3" />
      <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required className="border rounded-xl p-3" />
      <input name="phone" value={form.phone} onChange={onChange} placeholder="Teléfono" className="border rounded-xl p-3" />
      <textarea name="message" value={form.message} onChange={onChange} placeholder="Mensaje" rows="4" className="border rounded-xl p-3" />
      <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">Enviar</button>
      {status && <div className="text-sm">{status}</div>}
    </form>
  );
}
