// Mock data for car import website
export const mockCars = [
  {
    id: 1,
    make: "BMW",
    model: "Serie 3 320d",
    year: 2021,
    price: 28500,
    mileage: 45000,
    fuel: "Diésel",
    transmission: "Automático",
    color: "Negro Metálico",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
    ],
    location: "Múnich, Alemania",
    features: ["Navegador", "Cámara trasera", "Sensores aparcamiento", "Climatizador", "Llantas aleación"],
    description: "BMW Serie 3 en excelente estado, importado directamente desde Alemania. Historial completo de mantenimiento.",
    available: true,
    estimatedArrival: "2-3 semanas"
  },
  {
    id: 2,
    make: "Audi",
    model: "A4 Avant 2.0 TDI",
    year: 2020,
    price: 32000,
    mileage: 38000,
    fuel: "Diésel",
    transmission: "Automático",
    color: "Gris Daytona",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
    ],
    location: "Berlín, Alemania",
    features: ["Quattro", "Virtual Cockpit", "LED Matrix", "Asientos calefactados", "Techo panorámico"],
    description: "Audi A4 Avant con tracción Quattro, perfecto para familias que buscan elegancia y funcionalidad.",
    available: true,
    estimatedArrival: "1-2 semanas"
  },
  {
    id: 3,
    make: "Mercedes-Benz",
    model: "Clase C 220d",
    year: 2022,
    price: 35500,
    mileage: 25000,
    fuel: "Diésel",
    transmission: "Automático",
    color: "Blanco Polar",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1617886322207-baac2b8ef6e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
    ],
    location: "Stuttgart, Alemania",
    features: ["MBUX", "Cámara 360°", "Asistente de aparcamiento", "AMG Line", "Iluminación ambiental"],
    description: "Mercedes-Benz Clase C con el paquete AMG Line, máximo lujo y tecnología alemana.",
    available: false,
    estimatedArrival: "3-4 semanas"
  },
  {
    id: 4,
    make: "Volkswagen",
    model: "Golf GTI",
    year: 2021,
    price: 26800,
    mileage: 32000,
    fuel: "Gasolina",
    transmission: "Manual",
    color: "Rojo Tornado",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    location: "Wolfsburg, Alemania",
    features: ["Diferencial autoblocante", "Asientos deportivos", "Suspensión adaptativa", "Escape deportivo"],
    description: "Volkswagen Golf GTI, el icono de los hot hatch alemanes. Diversión pura al volante.",
    available: true,
    estimatedArrival: "2-3 semanas"
  },
  {
    id: 5,
    make: "Porsche",
    model: "Macan S",
    year: 2020,
    price: 58000,
    mileage: 42000,
    fuel: "Gasolina",
    transmission: "Automático",
    color: "Negro Basalto",
    images: [
      "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    location: "Stuttgart, Alemania",
    features: ["Sport Chrono", "Neumáticos deportivos", "Sistema de escape deportivo", "PCM", "Asientos ventilados"],
    description: "Porsche Macan S, el SUV deportivo perfecto que combina practicidad con prestaciones excepcionales.",
    available: true,
    estimatedArrival: "4-5 semanas"
  },
  {
    id: 6,
    make: "BMW",
    model: "X3 xDrive20d",
    year: 2021,
    price: 42000,
    mileage: 35000,
    fuel: "Diésel",
    transmission: "Automático",
    color: "Azul Mineral",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    location: "Múnich, Alemania",
    features: ["xDrive", "Head-Up Display", "Cámara trasera", "Sensores 360°", "Cargador inalámbrico"],
    description: "BMW X3 con tracción integral xDrive, ideal para aventuras familiares con máximo confort.",
    available: true,
    estimatedArrival: "2-3 semanas"
  }
];

export const companyInfo = {
  name: "AutoImport Iberia",
  description: "Especialistas en importación de vehículos premium desde Alemania",
  phone: "+34 912 345 678",
  email: "info@autoimportiberia.es",
  address: "Madrid, España",
  experience: "15+ años de experiencia",
  guarantee: "Garantía completa en todos los vehículos"
};