import ContactForm from '../components/ContactForm';
// …
<section className="container mx-auto px-4 py-10">
  <h2 className="text-2xl font-semibold mb-4">Contactar</h2>
  <ContactForm />
</section>


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Phone, Mail, MapPin, CheckCircle, Car } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { mockCars, companyInfo } from '../mockData';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const featuredCars = mockCars.filter(car => car.available).slice(0, 3);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast.success('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Vehículos Premium
                  <span className="block text-slate-700">desde Alemania</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  Importamos directamente desde Alemania los mejores vehículos con 
                  garantía completa y la máxima calidad alemana.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/stock">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-700 text-white px-8 py-3 text-lg group transition-all duration-300 hover:scale-105">
                    Ver Stock Disponible
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white px-8 py-3 text-lg transition-all duration-300"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Contactar Ahora
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-slate-900">15+</div>
                  <div className="text-sm text-slate-600">Años de experiencia</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-600">Vehículos importados</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-600">Garantía completa</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="BMW Premium"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-900">Garantía Alemana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Vehículos Destacados
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Selección de nuestros mejores vehículos disponibles actualmente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={car.images[0]} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-slate-900 text-white">
                      {car.available ? 'Disponible' : 'Reservado'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-900">
                      {car.year}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-2xl font-bold text-slate-900">
                    €{car.price.toLocaleString()}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>📍 {car.location}</div>
                    <div>⛽ {car.fuel}</div>
                    <div>🔧 {car.transmission}</div>
                    <div>📏 {car.mileage.toLocaleString()} km</div>
                  </div>
                  
                  <Link to={`/coche/${car.id}`}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-700 transition-colors duration-300 group">
                      Ver Detalles
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/stock">
              <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white px-8 py-3 transition-all duration-300">
                Ver Todo el Stock
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              La confianza de nuestros clientes nos avala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Garantía Completa',
                description: 'Todos nuestros vehículos incluyen garantía alemana oficial'
              },
              {
                icon: CheckCircle,
                title: 'Inspección Total',
                description: 'Revisión técnica completa antes de la importación'
              },
              {
                icon: Clock,
                title: 'Proceso Rápido',
                description: 'Gestión completa en 2-4 semanas desde Alemania'
              },
              {
                icon: Star,
                title: 'Calidad Premium',
                description: 'Solo vehículos de marcas premium alemanas'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow duration-300 border-slate-200">
                <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  ¿Buscas un vehículo específico?
                </h2>
                <p className="text-lg text-slate-600">
                  Déjanos tus datos y te ayudaremos a encontrar el vehículo perfecto desde Alemania.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{companyInfo.phone}</div>
                    <div className="text-slate-600">Lunes a Viernes 9:00 - 18:00</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{companyInfo.email}</div>
                    <div className="text-slate-600">Respuesta en 24 horas</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{companyInfo.address}</div>
                    <div className="text-slate-600">Servicio en toda España</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 shadow-lg border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre completo *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300 focus:border-slate-500"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300 focus:border-slate-500"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-slate-300 focus:border-slate-500"
                      placeholder="+34 123 456 789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mensaje *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="border-slate-300 focus:border-slate-500"
                      placeholder="Cuéntanos qué tipo de vehículo buscas..."
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3 transition-all duration-300 hover:scale-105"
                >
                  Enviar Mensaje
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;