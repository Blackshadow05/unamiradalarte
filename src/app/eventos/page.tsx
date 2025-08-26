import { PageHero } from '@/components/sections/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';

import { EventCard } from './EventCard';

export default function EventosPage() {
  return (
    <main className="min-h-screen pt-16 md:pt-20">
      <PageHero title="Eventos" subtitle="Exposiciones y eventos futuros" />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading>Próximos eventos</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventCard
            title="Exposición de esculturas en Cartago"
            description="Exposición de esculturas contemporáneas en el Museo de Arte de Cartago"
            date="2025-12-01"
            location="Cartago, Costa Rica"
          />
          <EventCard
            title="Festival de música en Limón"
            description="Festival de música tradicional y contemporánea en el Parque Vargas de Limón"
            date="2026-01-15"
            location="Limón, Costa Rica"
          />
          <EventCard
            title="Exposición de pintura en Puntarenas"
            description="Exposición de pintura costarricense en el Museo de Arte de Puntarenas"
            date="2026-02-28"
            location="Puntarenas, Costa Rica"
          />
        </div>
      </section>
    </main>
  );
}