const API_BASE = process.env.REACT_APP_API_BASE;

async function onSubmit(e) {
  e.preventDefault();
  setSending(true);
  setError(null);

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }

    // éxito
    toast.success('¡Mensaje enviado! Te contactamos en breve.');
    setForm({ name: '', email: '', phone: '', message: '' });
  } catch (err) {
    setError('No se pudo enviar el formulario.');
    console.error(err);
  } finally {
    setSending(false);
  }
}
