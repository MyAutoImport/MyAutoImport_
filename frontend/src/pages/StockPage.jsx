import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Search, Car as CarIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockCars } from '../mockData';

const StockPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMake, setFilterMake] = useState('all');
  const [filterFuel, setFilterFuel] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');

  // Get unique makes and fuels for filters
  const makes = [...new Set(mockCars.map(car => car.make))];
  const fuels = [...new Set(mockCars.map(car => car.fuel))];

  // Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    let filtered = mockCars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMake = filterMake === 'all' || car.make === filterMake;
      const matchesFuel = filterFuel === 'all' || car.fuel === filterFuel;
      
      let matchesPrice = true;
      if (filterPrice === 'under-30k') matchesPrice = car.price < 30000;
      else if (filterPrice === '30k-50k') matchesPrice = car.price >= 30000 && car.price <= 50000;
      else if (filterPrice === 'over-50k') matchesPrice = car.price > 50000;

      return matchesSearch && matchesMake && matchesFuel && matchesPrice;
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-desc': return b.year - a.year;
        case 'year-asc': return a.year - b.year;
        case 'mileage-asc': return a.mileage - b.mileage;
        case 'mileage-desc': return b.mileage - a.mileage;
        default: return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterMake, filterFuel, filterPrice, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-slate-900 p-3 rounded-xl">
                <CarIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Stock Disponible
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explora nuestra selección completa de vehículos premium importados desde Alemania
            </p>
            <div className="bg-slate-100 inline-flex items-center px-4 py-2 rounded-full text-sm text-slate-700">
              <span className="font-medium">{filteredAndSortedCars.length}</span>
              <span className="ml-1">vehículos disponibles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 focus:border-slate-500"
              />
            </div>

            {/* Make Filter */}
            <Select value={filterMake} onValueChange={setFilterMake}>
              <SelectTrigger className="border-slate-300">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {makes.map(make => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Fuel Filter */}
            <Select value={filterFuel} onValueChange={setFilterFuel}>
              <SelectTrigger className="border-slate-300">
                <SelectValue placeholder="Combustible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {fuels.map(fuel => (
                  <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={filterPrice} onValueChange={setFilterPrice}>
              <SelectTrigger className="border-slate-300">
                <SelectValue placeholder="Precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los precios</SelectItem>
                <SelectItem value="under-30k">Menos de €30,000</SelectItem>
                <SelectItem value="30k-50k">€30,000 - €50,000</SelectItem>
                <SelectItem value="over-50k">Más de €50,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-slate-300">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="year-desc">Año: Más Reciente</SelectItem>
                <SelectItem value="year-asc">Año: Más Antiguo</SelectItem>
                <SelectItem value="mileage-asc">Kilometraje: Menor</SelectItem>
                <SelectItem value="mileage-desc">Kilometraje: Mayor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAndSortedCars.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CarIcon className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">
                No se encontraron vehículos
              </h3>
              <p className="text-slate-600 mb-6">
                Intenta ajustar los filtros de búsqueda
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterMake('all');
                  setFilterFuel('all');
                  setFilterPrice('all');
                }}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white"
              >
                Limpiar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedCars.map((car) => (
                <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={car.images[0]} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={car.available ? "bg-green-600 text-white" : "bg-amber-600 text-white"}>
                        {car.available ? 'Disponible' : 'Reservado'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-slate-900">
                        {car.year}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-slate-700">
                        {car.estimatedArrival}
                      </div>
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
                      <div className="flex items-center space-x-2">
                        <span>📍</span>
                        <span>{car.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>⛽</span>
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🔧</span>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📏</span>
                        <span>{car.mileage.toLocaleString()} km</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Color:</span> {car.color}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {car.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                            {feature}
                          </Badge>
                        ))}
                        {car.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                            +{car.features.length - 3} más
                          </Badge>
                        )}
                      </div>
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
          )}
        </div>
      </section>
    </div>
  );
};

export default StockPage;