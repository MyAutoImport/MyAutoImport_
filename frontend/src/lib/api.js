// src/lib/api.js
const API_BASE = process.env.REACT_APP_API_BASE;

export async function fetchVehicles() {
  const res = await fetch(`${API_BASE}/api/vehicles`);
  if (!res.ok) throw new Error('Error cargando stock');
  return res.json();
}

export async function submitLead(payload) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error enviando contacto');
  return res.json();
}
