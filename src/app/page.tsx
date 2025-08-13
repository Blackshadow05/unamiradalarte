'use client';

import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
// Removed unused import to avoid TS noUnusedLocals
import { GalleryFull } from '@/components/sections/GalleryFull';
import ServicesList from '@/components/sections/ServicesList';
// import { Services } from '@/components/sections/Services'; // If not used, remove to avoid lint
import { Contact } from '@/components/sections/Contact';
import { RandomReviews } from '@/components/sections/RandomReviews';

import { useEffect, useRef } from 'react';
import { addVisitRow } from '@/lib/supabase-queries';
import Script from 'next/script';

export default function HomePage() {
  // Evitar doble inserción por montaje doble en StrictMode (dev)
  const hasLogged = useRef(false);

  useEffect(() => {
    let active = true;
    const log = async () => {
      if (hasLogged.current) return;
      hasLogged.current = true;
      try {
        await addVisitRow();
      } catch (e) {
        console.warn('No se pudo registrar visita al cargar la página principal', e);
      }
    };
    // Ejecutar tras hidratación
    const t = setTimeout(() => {
      if (active) log();
    }, 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, []);

  return (
    <main className="min-h-screen pt-16 md:pt-20">
      <Header />

      {/* Hero debe ir primero en la parte superior */}
      <Hero />

      {/* Galería destacada */}
      <section id="galeria" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Galería de retratos de mascotas</h2>
        <GalleryFull showFilters={false} featuredOnly={true} />
      </section>

      {/* Servicios principales */}
      <section id="servicios" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Retratos de mascotas: técnicas y opciones</h2>
        <p className="text-gray-600 mb-6">
          Trabajo en óleo, acrílico y lápiz a partir de tus fotos. Entrega típica en ~15 días y envíos a toda Costa Rica.
        </p>
        <ServicesList />
      </section>

      {/* Opiniones */}
      <section id="opiniones" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Opiniones de clientes</h2>
        <RandomReviews />
      </section>

      {/* Contacto */}
      <section id="contacto" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Contact />
      </section>
      <SimpleFooter />

      {/* JSON-LD: Person/Artist + Product/Offer genérico + FAQPage (sin reseñas por ahora) */}
      <Script id="ld-json-home" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': ['Person', 'Artist'],
              name: 'Una Mirada al Arte',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'San José',
                addressCountry: 'CR',
              },
              areaServed: 'Costa Rica',
              knowsAbout: [
                'retratos de mascotas',
                'retratos al óleo de perros',
                'retratos de gatos por encargo',
                'retrato acrílico de mascotas',
                'retrato a lápiz de mascotas',
              ],
            },
            {
              '@type': 'Product',
              name: 'Retrato de mascota a mano',
              description: 'Pintura personalizada en óleo, acrílico o lápiz a partir de foto. Entrega ~15 días. Envíos a toda Costa Rica.',
              brand: { '@type': 'Brand', name: 'Una Mirada al Arte' },
              offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                areaServed: 'Costa Rica',
              },
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '¿Cómo encargo un retrato de mi mascota?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'Envíame 1–3 fotos por WhatsApp o email. Te propongo boceto, técnica y tamaño. Tras tu aprobación, pinto y envío con embalaje seguro.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué fotos funcionan mejor?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'Fotos nítidas con buena luz, encuadre de frente o 3/4 y ojos enfocados. Puedo asesorarte si dudas entre varias opciones.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cuánto tarda y cómo se envía?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'El tiempo típico es de ~15 días (según técnica y tamaño). Envío mediante courier local con embalaje protector.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué técnicas y tamaños ofreces?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'Óleo, acrílico y lápiz. Tamaños comunes: 20×30, 30×40, 40×50 y formatos personalizados. Varias mascotas bajo presupuesto.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cuál es el precio y formas de pago?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'Trabajo con precios “desde” según técnica y tamaño. Consulta por WhatsApp para presupuesto y opciones de pago.',
                  },
                },
              ],
            },
          ],
        })}
      </Script>
    </main>
  );
}