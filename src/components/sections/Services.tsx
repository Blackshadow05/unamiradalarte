'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { 
  Palette, 
  Heart, 
  Clock, 
  Star, 
  CheckCircle, 
  Camera,
  Brush,
  Scissors,
  Package
} from 'lucide-react';

const services = [
  {
    id: 'retrato-personalizado',
    title: 'Retrato Personalizado de Mascota',
    description: 'Retrato único y detallado de tu mascota, capturando su personalidad y esencia con técnicas profesionales.',
    image: '/api/placeholder/400/300',
    price: 45000,
    duration: '2-3 semanas',
    technique: 'Óleo sobre lienzo',
    sizes: [
      { name: '30x40 cm', price: 35000 },
      { name: '40x50 cm', price: 45000 },
      { name: '50x60 cm', price: 65000 },
    ],
    features: [
      'Consulta personalizada',
      'Boceto previo incluido',
      'Revisiones ilimitadas',
      'Marco opcional',
      'Entrega a domicilio',
    ],
    process: [
      'Envías fotos de tu mascota',
      'Realizamos consulta personalizada',
      'Creo boceto para aprobación',
      'Desarrollo el retrato final',
      'Entrega y seguimiento',
    ],
    popular: true,
  },
  {
    id: 'retrato-multiple',
    title: 'Retrato de Múltiples Mascotas',
    description: 'Retrato grupal perfecto para familias con varias mascotas, manteniendo la armonía y personalidad de cada una.',
    image: '/api/placeholder/400/300',
    price: 75000,
    duration: '3-4 semanas',
    technique: 'Óleo o acrílico sobre lienzo',
    sizes: [
      { name: '50x60 cm', price: 75000 },
      { name: '60x80 cm', price: 95000 },
      { name: '70x90 cm', price: 120000 },
    ],
    features: [
      'Hasta 4 mascotas',
      'Composición personalizada',
      'Boceto detallado',
      'Revisiones incluidas',
      'Empaque premium',
    ],
    process: [
      'Fotos individuales de cada mascota',
      'Diseño de composición',
      'Boceto para aprobación',
      'Pintura del retrato grupal',
      'Entrega con certificado',
    ],
  },
  {
    id: 'amigurumi-personalizado',
    title: 'Amigurumi Personalizado',
    description: 'Versión tierna y adorable de tu mascota tejida a mano con técnica de crochet, perfecta como regalo.',
    image: '/api/placeholder/400/300',
    price: 25000,
    duration: '1-2 semanas',
    technique: 'Crochet con hilo de algodón',
    sizes: [
      { name: 'Pequeño (15 cm)', price: 20000 },
      { name: 'Mediano (20 cm)', price: 25000 },
      { name: 'Grande (25 cm)', price: 35000 },
    ],
    features: [
      'Materiales premium',
      'Colores personalizados',
      'Accesorios incluidos',
      'Lavable a mano',
      'Empaque de regalo',
    ],
    process: [
      'Selección de colores y tamaño',
      'Tejido personalizado',
      'Detalles y acabados',
      'Control de calidad',
      'Empaque y entrega',
    ],
  },
  {
    id: 'bodegon-tropical',
    title: 'Bodegón Tropical',
    description: 'Hermosas composiciones con flora y fauna costarricense, perfectas para decorar espacios con arte local.',
    image: '/api/placeholder/400/300',
    price: 38000,
    duration: '2-3 semanas',
    technique: 'Acrílico o acuarela',
    sizes: [
      { name: '40x50 cm', price: 35000 },
      { name: '50x60 cm', price: 45000 },
      { name: '60x80 cm', price: 65000 },
    ],
    features: [
      'Temática costarricense',
      'Colores vibrantes',
      'Técnica mixta opcional',
      'Inspiración natural',
      'Certificado de autenticidad',
    ],
    process: [
      'Selección de temática',
      'Boceto conceptual',
      'Desarrollo de la obra',
      'Detalles finales',
      'Entrega certificada',
    ],
  },
  {
    id: 'restauracion',
    title: 'Restauración de Retratos',
    description: 'Servicio especializado para restaurar y revitalizar retratos antiguos o dañados de tus mascotas.',
    image: '/api/placeholder/400/300',
    price: 55000,
    duration: '3-4 semanas',
    technique: 'Técnicas de restauración',
    features: [
      'Evaluación gratuita',
      'Técnicas profesionales',
      'Conservación del original',
      'Documentación del proceso',
      'Garantía de calidad',
    ],
    process: [
      'Evaluación del estado',
      'Propuesta de restauración',
      'Proceso de restauración',
      'Acabados protectores',
      'Entrega con informe',
    ],
  },
  {
    id: 'comision-especial',
    title: 'Comisión Especial',
    description: 'Proyectos únicos y personalizados que van más allá de los servicios estándar. Hablemos de tu idea.',
    image: '/api/placeholder/400/300',
    price: 0, // Precio a consultar
    duration: 'Variable',
    technique: 'Técnica mixta',
    features: [
      'Proyecto completamente personalizado',
      'Consulta detallada',
      'Presupuesto personalizado',
      'Seguimiento exclusivo',
      'Resultado único',
    ],
    process: [
      'Consulta inicial gratuita',
      'Desarrollo de propuesta',
      'Presupuesto detallado',
      'Ejecución del proyecto',
      'Entrega personalizada',
    ],
    custom: true,
  },
];

const additionalServices = [
  {
    icon: Camera,
    title: 'Sesión Fotográfica',
    description: 'Sesión profesional para capturar las mejores fotos de tu mascota',
    price: 15000,
  },
  {
    icon: Package,
    title: 'Enmarcado Premium',
    description: 'Marco profesional que realza y protege tu obra de arte',
    price: 12000,
  },
  {
    icon: Brush,
    title: 'Retoques Menores',
    description: 'Pequeños ajustes o correcciones en obras existentes',
    price: 8000,
  },
];

export function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: number }>({});

  const handleSizeSelection = (serviceId: string, sizeIndex: number) => {
    setSelectedSize(prev => ({
      ...prev,
      [serviceId]: sizeIndex
    }));
  };

  const getServicePrice = (service: any) => {
    if (service.custom) return 'Consultar';
    if (service.sizes && selectedSize[service.id] !== undefined) {
      return formatPrice(service.sizes[selectedSize[service.id]].price);
    }
    return formatPrice(service.price);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Spacing for content after PageHero */}
        <div className="mb-16"></div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover-lift">
              {service.popular && (
                <div className="bg-primary-500 text-white text-center py-2 text-sm font-medium">
                  ⭐ Más Popular
                </div>
              )}
              
              <div className="relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    {service.duration}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <span className="text-lg font-bold text-primary-500">
                    {getServicePrice(service)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Brush className="h-4 w-4 mr-2" />
                    {service.technique}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {service.duration}
                  </div>
                </div>

                {/* Size Options */}
                {service.sizes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Tamaños disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => handleSizeSelection(service.id, index)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedSize[service.id] === index
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size.name} - {formatPrice(size.price)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Incluye:</p>
                  <div className="space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                  >
                    {selectedService === service.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                  </Button>
                  <Button variant="outline">
                    Solicitar
                  </Button>
                </div>

                {/* Expanded Details */}
                {selectedService === service.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* All Features */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Todo lo que incluye:</h4>
                        <div className="space-y-2">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Process */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Proceso:</h4>
                        <div className="space-y-2">
                          {service.process.map((step, index) => (
                            <div key={index} className="flex items-start text-sm text-gray-600">
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-600 rounded-full text-xs font-medium mr-2 flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Servicios Adicionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-6 text-center hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                    <Icon className="h-6 w-6 text-primary-500" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="text-lg font-bold text-primary-500">
                    {formatPrice(service.price)}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary-50 to-accent-50">
            <h3 className="text-2xl font-bold mb-4">¿Listo para inmortalizar a tu mascota?</h3>
            <p className="text-gray-600 mb-6">
              Cada retrato es único y está hecho con amor y dedicación. 
              Contáctame para discutir tu proyecto y crear algo especial juntos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Solicitar Cotización
              </Button>
              <Button variant="outline" size="lg">
                Ver Galería
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}