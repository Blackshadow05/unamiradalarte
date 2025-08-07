import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { GalleryFull } from '@/components/sections/GalleryFull';
import { PageHero } from '@/components/sections/PageHero';

export default function GaleriaPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PageHero 
        title="Galería Completa"
        subtitle="Explora toda mi colección de obras de arte. Desde retratos emotivos hasta paisajes inspiradores y artesanías únicas."
        badge="Obras Artísticas"
      />
      <GalleryFull />
      <SimpleFooter />
    </main>
  );
}