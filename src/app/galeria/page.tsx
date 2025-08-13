import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { GalleryFull } from '@/components/sections/GalleryFull';
import { PageHero } from '@/components/sections/PageHero';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Galería de retratos de mascotas | Una Mirada al Arte',
  description:
    'Explora retratos de mascotas pintados a mano: perros, gatos, caballos, aves y exóticos. Óleo, acrílico y lápiz. San José, Costa Rica. Envíos a todo el país.',
  keywords:
    'galería retratos de mascotas, retratos de perros, retratos de gatos, arte de mascotas, óleo acrílico lápiz, San José Costa Rica',
  openGraph: {
    title: 'Galería | Retratos de mascotas pintados a mano',
    description:
      'Obras originales en óleo, acrílico y lápiz. Especialista en retratos de mascotas en San José, Costa Rica.',
    type: 'website',
  },
};

export default function GaleriaPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PageHero 
        title="Galería Retratos de Mascotas"
        subtitle="Explora mi colección de retratos de perros, gatos, caballos, aves y mascotas exóticas. Obras pintadas a mano en óleo, acrílico y lápiz."
        badge="Galería"
      />
      <section id="galeria" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="sr-only">Galería de retratos de mascotas</h2>
        <GalleryFull />
      </section>
      <SimpleFooter />

      {/* JSON-LD para CollectionPage y Breadcrumbs */}
      <Script id="ld-json-gallery" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: 'Galería de retratos de mascotas',
              description:
                'Galería de obras originales: retratos de perros, gatos, caballos, aves y exóticos en óleo, acrílico y lápiz.',
              about: [
                'retratos de perros',
                'retratos de gatos',
                'retratos de caballos',
                'retratos de aves',
                'retratos de mascotas exóticas',
              ],
              isPartOf: { '@type': 'WebSite', name: 'Una Mirada al Arte' },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Inicio',
                  item: '/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Galería',
                  item: '/galeria',
                },
              ],
            },
          ],
        })}
      </Script>
    </main>
  );
}