import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ContactForm from '../components/ContactForm';

const API_BASE = process.env.REACT_APP_API_BASE;

const HomePage = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vehicles`);
        const data = await res.json();
        setFeatured((data || []).slice(0, 3));
      } catch {
        setFeatured([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Vehículos Premium <span className="block text-slate-700">desde Alemania</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg">
                Importamos directamente desde Alemania los mejores vehículos con
                garantía completa y la máxima calidad alemana.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/stock">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-700 text-white px-8 py-3 text-lg">
                    Ver Stock Disponible <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white px-8 py-3 text-lg"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Contactar Ahora
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">15+</div>
                  <div className="text-sm text-slate-600">Años de experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-600">Vehículos importados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-600">Garantía completa</div>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop"
                alt="BMW Premium"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Vehículos Destacados</h2>
            <p className="text-lg text-slate-600">Selección de lo disponible ahora mismo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((car) => (
              <Card key={car.id} className="group border-slate-200">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={car.images?.[0] || '/img/placeholder.jpg'}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-slate-900 text-white">Disponible</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-900">{car.year}</Badge>
                  </div>
                </div>

                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900">{car.make} {car.model}</h3>
                  <p className="text-2xl font-bold text-slate-900">
                    {new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(car.price ?? 0)}
                  </p>
                </CardHeader>

                <CardContent>
                  <Link to={`/coche/${car.id}`}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-700">Ver Detalles</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/stock">
              <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white px-8 py-3">
                Ver Todo el Stock <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">¿Por qué elegirnos?</h2>
            <p className="text-lg text-slate-600">La confianza de nuestros clientes nos avala</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Garantía Completa', description: 'Garantía oficial alemana' },
              { icon: CheckCircle, title: 'Inspección Total', description: 'Revisión técnica completa' },
              { icon: Clock, title: 'Proceso Rápido', description: '2-4 semanas desde Alemania' },
              { icon: Star, title: 'Calidad Premium', description: 'Marcas premium alemanas' },
            ].map((f, i) => (
              <Card key={i} className="text-center p-8 border-slate-200">
                <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <f.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">¿Buscas un vehículo específico?</h2>
            <p className="text-lg text-slate-600">Déjanos tus datos y te ayudaremos a encontrarlo.</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-700"><Phone className="h-5 w-5" /> <span>+34 912 345 678</span></div>
              <div className="flex items-center space-x-3 text-slate-700"><Mail className="h-5 w-5" /> <span>info@autoimportiberia.es</span></div>
              <div className="flex items-center space-x-3 text-slate-700"><MapPin className="h-5 w-5" /> <span>Madrid, España</span></div>
            </div>
          </div>

          <Card className="p-8 shadow-lg border-slate-200">
            <ContactForm />
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
