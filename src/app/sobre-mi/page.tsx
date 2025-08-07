import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { AboutDetail } from '@/components/sections/AboutDetail';
import { PageHero } from '@/components/sections/PageHero';

export const metadata = {
  title: 'Sobre Mí | Una Mirada al Arte',
  description: 'Conoce mi trayectoria artística, mi pasión por los retratos de mascotas y mi camino en el mundo del arte.',
};

export default function SobreMiPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PageHero 
        title="Sobre Mí"
        subtitle="Conoce mi historia, mi pasión por el arte y cómo llegué a especializarme en retratos de mascotas que capturan el alma de nuestros compañeros más fieles."
        badge="La Artista"
      />
      <AboutDetail />
      <SimpleFooter />
    </main>
  );
}