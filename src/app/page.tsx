'use client';

import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { FeaturedWorks } from '@/components/sections/FeaturedWorks';
import { Services } from '@/components/sections/Services';
import { Contact } from '@/components/sections/Contact';
import { RandomReviews } from '@/components/sections/RandomReviews';

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

      {/* Sección de Mis Servicios (componente reutilizable) */}
      <div id="mis-servicios">
        <Services />
      </div>

      {/* Sobre Mí removido de la home */}
      <RandomReviews />
      <Contact />
      <SimpleFooter />
    </main>
  );
}