"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { ContactForm } from '@/components/forms/ContactForm';
import Link from 'next/link';
import { Ruler, Tag } from 'lucide-react';

type Service = {
  title: string;
  price: string;
  description: string;
  size: string;
};

const services: Service[] = [
  {
    title: 'Retrato de mascotas',
    price: 'Desde ₡25,000',
    description:
      'Retrato de mascotas pintado a mano que captura la personalidad y expresión de tu compañero, con detalles realistas y colores vibrantes.',
    size: '20x20 cm: ₡25,000\n30x30 cm: ₡30,000\n50x50 cm: ₡50,000',
  },
  {
    title: 'Venta de amigurumis',
    price: '₡15,000',
    description:
      'Amigurumis hechos a mano, perfectos como regalos o decoración. Cada pieza es única y llena de cariño.',
    size: '20 cm',
  },
  {
    title: 'Bodegones',
    price: '₡30,000',
    description:
      'Obras de arte que representan la belleza de la naturaleza y la vida cotidiana. Diseños modernos para realzar cualquier espacio.',
    size: '40x50 cm',
  },
  {
    title: 'Murales',
    price: '₡100,000',
    description:
      'Transforma tu espacio con un mural personalizado que refleje tu estilo y personalidad. Gran formato y acabado duradero.',
    size: 'Variable',
  },
  {
    title: 'Clases privadas',
    price: '₡10,000 por sesión',
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
            <div
              key={idx}
              className="group relative rounded-2xl transition-transform duration-300 hover:-translate-y-1"
            >
              <Card className="relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:ring-gray-200">
                {/* Header */}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <div className="mt-2 inline-flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold px-2.5 py-1 border border-pink-100">
                          <Tag className="h-3.5 w-3.5" /> {service.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent>
                  <p className="text-sm text-gray-800 mb-4 leading-relaxed">{service.description}</p>

                  {service.size.includes('\n') && service.size.includes(':') ? (
                    <div className="rounded-xl border border-gray-100 bg-gray-50/70">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <h4 className="text-xs font-semibold text-gray-700 tracking-wide uppercase">Precios por tamaño</h4>
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {service.size
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, i) => {
                            const parts = line.split(':');
                            const label = parts[0]?.trim();
                            const value = parts.slice(1).join(':').trim();
                            return (
                              <li key={i} className="flex items-center justify-between px-4 py-3">
                                <span className="text-sm text-gray-700">{label}</span>
                                <span className="text-[13px] font-semibold text-gray-900 bg-white border border-gray-200 rounded-full px-2.5 py-1">
                                  {value}
                                </span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50/70 border border-gray-100 rounded-xl px-3 py-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Tamaño:</span>
                      <span className="text-gray-800">{service.size}</span>
                    </div>
                  )}
                </CardContent>

                {/* Footer */}
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