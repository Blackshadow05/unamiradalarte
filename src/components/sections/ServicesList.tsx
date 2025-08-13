"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { ContactForm } from '@/components/forms/ContactForm';
import Link from 'next/link';

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
            <div key={idx} className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-primary-400/50 via-fuchsia-400/40 to-amber-400/50 transition-transform duration-300 hover:-translate-y-1">
              <Card className="relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                <div className="pointer-events-none absolute -top-16 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary-300/40 to-amber-300/40 blur-3xl" />
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
                  <Link
                    href="/#contacto"
                    aria-label={`Solicitar ${service.title}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white shadow-md bg-gradient-to-r from-pink-500 to-pink-600 transition-all hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Contactar
                  </Link>
                </CardFooter>
              </Card>
            </div>
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