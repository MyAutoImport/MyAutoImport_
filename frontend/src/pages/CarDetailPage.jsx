import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Phone, Mail, MapPin, Calendar, Fuel, Settings, Palette, Check, Star, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { mockCars, companyInfo } from '../mockData';

const API_BASE = process.env.REACT_APP_API_BASE; // e.g. https://my-auto-importbackend.vercel.app

// Helper para imágenes relativas (/img/...)
const resolveImg = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${process.env.PUBLIC_URL || ''}${src}`;
};

// Coincidir id numérico o string (mock vs Supabase)
const sameId = (a, b) => String(a) === String(b);

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) Intentar API
      try {
        if (API_BASE) {
          const res = await fetch(`${API_BASE}/api/vehicles`);
          if (res.ok) {
            const list = await res.json();
            const found = list.find((v) => sameId(v.id, id));
            if (!cancelled && found) {
              // Normalizar imágenes a URLs absolutas si son relativas
              const norm = {
                ...found,
                images: Array.isArray(found.images)
                  ? found.images.map(resolveImg)
                  : []
              };
              setCar(norm);
              return;
            }
          }
        }
      } catch (_) {
        // ignorar y caer a mock
      }

      // 2) Fallback: mockCars
      const fromMock = mockCars.find((c) => sameId(c.id, id));
      if (!cancelled && fromMock) {
        setCar({
          ...fromMock,
          images: Array.isArray(fromMock.images)
            ? fromMock.images.map(resolveImg)
            : []
        });
      } else if (!cancelled) {
        navigate('/stock');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, navigate]);

  const handleContactClick = () => {
    toast.success('¡Solicitud enviada! Nos pondremos en contacto contigo pronto para más información sobre este vehículo.');
  };

  const handleImageNavigation = (direction) => {
    if (!car) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === car.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? car.images.length - 1 : prev - 1
      );
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p>Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/stock" className="hover:text-slate-900 transition-colors">Stock</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{car.make} {car.model}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={resolveImg(car.images[currentImageIndex])}
                alt={`${car.make} ${car.model} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ArrowLeft className="h-5 w-5 text-slate-900" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ArrowRight className="h-5 w-5 text-slate-900" />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4">
                <Badge className={car.available ? "bg-green-600 text-white" : "bg-amber-600 text-white"}>
                  {car.available ? 'Disponible' : 'Reservado'}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-sm">Llegada estimada:</span>
                      <div className="font-medium">{car.estimatedArrival || '—'}</div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{car.location || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image thumbnails */}
            {car.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'ring-2 ring-slate-900 scale-105' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={resolveImg(image)}
                      alt={`${car.make} ${car.model} - Miniatura ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    {car.make} {car.model}
                  </h1>
                  <p className="text-lg text-slate-600 mt-2">
                    Año {car.year} • {car.mileage?.toLocaleString?.('es-ES') || car.mileage} km
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    €{(car.price ?? 0).toLocaleString('es-ES')}
                  </div>
                  <div className="text-sm text-slate-600">Precio final</div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                {car.description || ''}
              </p>
            </div>

            {/* Key Specs */}
            <Card className="border-slate-200">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Especificaciones Principales</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Año</div>
                      <div className="text-slate-600">{car.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Fuel className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Combustible</div>
                      <div className="text-slate-600">{car.fuel}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Transmisión</div>
                      <div className="text-slate-600">{car.transmission || '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Color</div>
                      <div className="text-slate-600">{car.color || '—'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-slate-200">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Equipamiento</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(car.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guarantee */}
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Garantía Alemana Incluida</h4>
                    <p className="text-slate-700 text-sm">
                      Este vehículo incluye garantía oficial alemana, gestión completa de documentación 
                      e inspección técnica pre-importación. Proceso transparente y seguro.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <div className="space-y-4">
              <Button 
                onClick={handleContactClick}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white py-4 text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Solicitar Información
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white py-3 transition-all duration-300"
                  onClick={() => window.open(`tel:${companyInfo.phone}`)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white py-3 transition-all duration-300"
                  onClick={() => window.open(`mailto:${companyInfo.email}?subject=Consulta sobre ${car.make} ${car.model}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Vehículos Similares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(mockCars
              .filter(c => !sameId(c.id, car.id) && c.make === car.make)
              .slice(0, 3)).map((similarCar) => (
                <Card key={similarCar.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={resolveImg(similarCar.images[0])}
                      alt={`${similarCar.make} ${similarCar.model}`}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={similarCar.available ? "bg-green-600 text-white" : "bg-amber-600 text-white"}>
                        {similarCar.available ? 'Disponible' : 'Reservado'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {similarCar.make} {similarCar.model}
                    </h3>
                    <p className="text-xl font-bold text-slate-900">
                      €{similarCar.price.toLocaleString('es-ES')}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <Link to={`/coche/${similarCar.id}`}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-700 transition-colors duration-300 group">
                        Ver Detalles
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
