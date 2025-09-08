import React, { useEffect, useState } from 'react';
const API_BASE = process.env.REACT_APP_API_BASE;

export default function StockPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vehicles`);
        if (!res.ok) throw new Error('fail');
        const data = await res.json();
        setCars(data);
      } catch (e) {
        setErr('No se pudo cargar el stock');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-10">Cargando…</div>;
  if (err) return <div className="container mx-auto px-4 py-10 text-red-600">{err}</div>;

  return (
    <div className="container mx-auto px-4 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map(c => (
        <article key={c.id} className="border rounded-2xl overflow-hidden shadow-sm">
          <img src={(c.images?.[0] || '/img/placeholder.jpg')} alt={`${c.make} ${c.model}`} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{c.make} {c.model} ({c.year})</h3>
            <p className="text-slate-600">
              {new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(c.price ?? 0)}
              {' · '}{c.fuel ?? ''}{' · '}{(c.mileage ?? 0).toLocaleString('es-ES')} km
            </p>
            <a href={`/coche/${v.id}`} className="inline-block mt-3 px-4 py-2 rounded-xl bg-black text-white">Ver detalles</a>
          </div>
        </article>
      ))}
    </div>
  );
}
