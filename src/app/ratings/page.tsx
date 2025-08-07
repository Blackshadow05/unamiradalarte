import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { AllReviews } from '@/components/sections/AllReviews';
import { PageHero } from '@/components/sections/PageHero';


export const metadata = {
  title: 'Todas las Reseñas | Una Mirada Astro',
  description: 'Lee todas las reseñas y calificaciones de nuestros clientes satisfechos. Testimonios reales sobre nuestras obras de arte.',
  keywords: 'reseñas, calificaciones, testimonios, clientes, arte, obras, opiniones',
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PageHero 
        title="Todas las Reseñas"
        subtitle="Descubre lo que nuestros clientes dicen sobre nuestras obras de arte. Testimonios reales de personas que han confiado en nuestro trabajo."
        badge="Testimonios"
      />
      <AllReviews />
      <SimpleFooter />

    </main>
  );
}