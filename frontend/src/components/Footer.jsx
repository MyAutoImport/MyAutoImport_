import React from 'react';
import { Car, Phone, Mail, MapPin, Shield, Clock } from 'lucide-react';

const companyInfo = {
  name: 'AutoImport Iberia',
  description: 'Especialistas en importación de vehículos premium desde Alemania',
  guarantee: 'Garantía completa en todos los vehículos',
  phone: '+34 912 345 678',
  email: 'info@autoimportiberia.es',
  address: 'Madrid, España',
  experience: '15+ años de experiencia'
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-xl">
                <Car className="h-6 w-6 text-slate-900" />
              </div>
              <span className="text-xl font-bold">{companyInfo.name}</span>
            </div>
            <p className="text-slate-300 text-sm">{companyInfo.description}</p>
            <div className="flex items-center space-x-3 text-sm text-slate-300">
              <Shield className="h-4 w-4" />
              <span>{companyInfo.guarantee}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-slate-300"><Phone className="h-4 w-4" /><span>{companyInfo.phone}</span></div>
              <div className="flex items-center space-x-3 text-sm text-slate-300"><Mail className="h-4 w-4" /><span>{companyInfo.email}</span></div>
              <div className="flex items-center space-x-3 text-sm text-slate-300"><MapPin className="h-4 w-4" /><span>{companyInfo.address}</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Servicios</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div>Importación desde Alemania</div>
              <div>Gestión de documentación</div>
              <div>Inspección técnica</div>
              <div>Garantía extendida</div>
              <div>Financiación disponible</div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Experiencia</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-slate-300"><Clock className="h-4 w-4" /><span>{companyInfo.experience}</span></div>
              <div className="text-sm text-slate-300">Más de 500 vehículos importados exitosamente desde Alemania a España.</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-400">© 2024 {companyInfo.name}. Todos los derechos reservados.</div>
          <div className="flex space-x-6 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer">Política de Privacidad</span>
            <span className="hover:text-white cursor-pointer">Términos de Servicio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
