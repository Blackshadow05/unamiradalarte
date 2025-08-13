import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { PageHero } from '@/components/sections/PageHero';
import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Sobre Mí (Prueba) | Una Mirada al Arte',
  description:
    'Versión de prueba de la página Sobre Mí: mi historia, imagen y una línea de tiempo de mi trayectoria artística.',
  openGraph: {
    title: 'Sobre Mí (Prueba) | Una Mirada al Arte',
    description:
      'Conoce mi historia y trayectoria artística en esta versión de prueba de la página Sobre Mí.',
    type: 'profile',
  },
};

const timeline = [
  {
    year: '2022',
    title: 'Primeros retratos por encargo',
    description:
      'Empecé a ofrecer retratos personalizados de mascotas a familiares y amigos.',
  },
  {
    year: '2023',
    title: 'Perfeccionamiento de técnicas',
    description:
      'Profundicé en óleo y acrílico, y asumí proyectos de mayor complejidad.',
  },
  {
    year: '2024',
    title: 'Lanzamiento de marca personal',
    description:
      'Consolidé mi presencia como artista y abrí una galería digital de mis obras.',
  },
  {
    year: '2025',
    title: 'Nuevos horizontes',
    description:
      'Exploración de estilos y materiales para elevar la experiencia artística.',
  },
];

export default function SobreMiPruebaPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PageHero
        title="Sobre Mí"
        subtitle="Conoce mi historia, mi pasión por el arte y cómo llegué a especializarme en retratos de mascotas."
        badge="La Artista"
      />

      {/* Sección principal: Mi Historia + Imagen */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contenido (izquierda en escritorio, arriba en móvil) */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Mi Historia</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Soy una artista costarricense apasionada por capturar la esencia y personalidad
              de las mascotas a través del arte. Mi camino artístico comenzó hace tres años cuando
              descubrí que podía combinar mi amor por los animales con mi talento artístico.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed"> 
              Lo que comenzó como un hobby se convirtió en mi pasión de vida. Cada retrato 
              que creo es más que una simple pintura; es un homenaje al amor incondicional 
              que nos brindan nuestros compañeros peludos y una forma de preservar esos 
              momentos especiales para siempre. 
            </p> 
 
            <p className="text-lg text-gray-600 mb-8 leading-relaxed"> 
              Mi especialidad son los retratos realistas que no solo capturan la apariencia 
              física, sino también el carácter único de cada mascota. Trabajo principalmente 
              con óleo y acrílico, pero también he incorporado el amigurumi para crear 
              versiones tiernas de la fauna costarricense. 
            </p>
          </div>

          {/* Imagen (derecha en escritorio, abajo en móvil) */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/images/WhatsApp Image 2025-08-12 at 4.14.45 PM.jpeg"
                alt="Artista en su estudio"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-200 rounded-full opacity-60 animate-float" />
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent-200 rounded-full opacity-60 animate-float"
              style={{ animationDelay: '2s' }}
            />
          </div>
        </div>
      </section>

      {/* Sección: Mi trayectoria (línea de tiempo) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Mi trayectoria</h3>
          <p className="text-lg text-gray-600">Algunos hitos destacados a lo largo de mi camino artístico</p>
        </div>

        <div className="relative">
          {/* Línea vertical de la timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'pr-0 lg:pr-8 text-right' : 'pl-0 lg:pl-8 text-left'}`}>
                  <Card className="p-6">
                    <div className="text-2xl font-bold text-primary-500 mb-2">{item.year}</div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </Card>
                </div>

                {/* Punto de la timeline */}
                <div className="relative z-10 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg mx-4" />

                <div className="hidden lg:block w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SimpleFooter />

      {/* JSON-LD para AboutPage y Breadcrumbs */}
      <Script id="ld-json-about-test" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'AboutPage',
              name: 'Sobre Mí (Prueba)',
              description:
                'Versión de prueba de la página Sobre Mí con historia, imagen y trayectoria.',
              isPartOf: { '@type': 'WebSite', name: 'Una Mirada al Arte' },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: '/' },
                { '@type': 'ListItem', position: 2, name: 'Sobre Mí (Prueba)', item: '/sobre-mi-2' },
              ],
            },
          ],
        })}
      </Script>
    </main>
  );
}