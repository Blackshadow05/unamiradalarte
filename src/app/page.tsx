'use client';

import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { FeaturedWorks } from '@/components/sections/FeaturedWorks';
import { Services } from '@/components/sections/Services';
import { Contact } from '@/components/sections/Contact';
import { RandomReviews } from '@/components/sections/RandomReviews';
import { SupabaseDebug } from '@/components/debug/SupabaseDebug';

import { useEffect, useRef } from 'react';
import { addVisitRow } from '@/lib/supabase-queries';
 
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

      {/* Obras destacadas */}
      <FeaturedWorks />

      {/* Sección de Mis Servicios (teaser de 3 servicios + CTA) */}
      <section id="mis-servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Mis Servicios</h2>
            <p className="mt-3 text-gray-600">Una muestra de lo que puedo crear para ti</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1 */}
            <div className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Retrato Personalizado</h3>
              <p className="text-gray-600 text-sm mb-4">Captura la esencia única de tu mascota en un retrato hecho a mano.</p>
            </div>
            {/* Tarjeta 2 */}
            <div className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Retrato Múltiple</h3>
              <p className="text-gray-600 text-sm mb-4">Composición armoniosa con varias mascotas en una misma obra.</p>
            </div>
            {/* Tarjeta 3 */}
            <div className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Amigurumi Personalizado</h3>
              <p className="text-gray-600 text-sm mb-4">Una versión adorable de tu mascota tejida con detalle y cariño.</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="/servicios"
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 text-white px-6 py-3 font-medium hover:bg-primary-600 transition-colors"
            >
              Ver más servicios
            </a>
          </div>
        </div>
      </section>

      {/* Sobre Mí removido de la home */}
      <RandomReviews />
      <Contact />
      <SimpleFooter />
      <SupabaseDebug />
    </main>
  );
}