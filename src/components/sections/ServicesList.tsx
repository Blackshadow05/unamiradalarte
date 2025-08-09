import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { ContactForm } from '@/components/forms/ContactForm';

type Service = {
  title: string;
  price: string;
  description: string;
  size: string;
};

const services: Service[] = [
  {
    title: 'Retrato de mascotas',
    price: '25,000 colones',
    description:
      'Retrato de mascotas pintado a mano que captura la personalidad y expresión de tu compañero, con detalles realistas y colores vibrantes.',
    size: '30x40 cm',
  },
  {
    title: 'Venta de amigurumis',
    price: '15,000 colones',
    description:
      'Amigurumis hechos a mano, perfectos como regalos o decoración. Cada pieza es única y llena de cariño.',
    size: '20 cm',
  },
  {
    title: 'Bodegones',
    price: '30,000 colones',
    description:
      'Obras de arte que representan la belleza de la naturaleza y la vida cotidiana. Diseños modernos para realzar cualquier espacio.',
    size: '40x50 cm',
  },
  {
    title: 'Murales',
    price: '100,000 colones',
    description:
      'Transforma tu espacio con un mural personalizado que refleje tu estilo y personalidad. Gran formato y acabado duradero.',
    size: 'Variable',
  },
  {
    title: 'Clases privadas',
    price: '10,000 colones por sesión',
    description:
      'Aprende a crear arte en clases personalizadas, adaptadas a tu nivel y estilo. Sesiones prácticas y seguimiento individual.',
    size: 'Variable',
  },
];

const ServicesList: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section aria-label="Mis Servicios" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Mis Servicios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Card key={idx} hover={true} className="transition-all">
              <CardHeader>
                <div className="flex items-center justify-between text-pink-800">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <span className="text-sm font-semibold">{service.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-800">{service.description}</p>
                <p className="text-xs text-gray-500 mt-2">Tamaño: {service.size}</p>
              </CardContent>
              <CardFooter>
                <button
                  aria-label={`Solicitar ${service.title}`}
                  onClick={() => window.location.href = '#contacto'}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  Contactar
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="bg-white rounded-lg shadow-lg z-10 p-6">
            <ContactForm />
            <button onClick={() => setModalOpen(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesList;