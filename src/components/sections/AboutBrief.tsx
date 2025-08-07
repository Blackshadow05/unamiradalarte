import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

const achievements = [
  {
    count: '5+',
    title: 'Técnicas Dominadas',
    description: 'Óleo, acrílico, crochet y técnicas mixtas',
  },
  {
    count: '200+',
    title: 'Retratos Realizados',
    description: 'Mascotas inmortalizadas con amor y dedicación',
  },
  {
    count: '3+',
    title: 'Años de Experiencia',
    description: 'Dedicación constante al arte y los retratos',
  },
  {
    count: '150+',
    title: 'Familias Felices',
    description: 'Clientes satisfechos con sus retratos',
  },
];

export function AboutBrief() {
  return (
    <section id="sobre-mi" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre <span className="text-gradient">Mí</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce mi historia, mi pasión por el arte y cómo llegué a especializarme
            en retratos de mascotas que capturan el alma de nuestros compañeros más fieles.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-primary-500 mr-2" />
              <span className="text-lg text-gray-600">San José, Costa Rica</span>
            </div>

            <h3 className="text-3xl font-bold mb-6">Mi Historia</h3>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
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

            {/* Skills */}
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-4">Mis Especialidades</h4>
              <div className="flex flex-wrap gap-3">
                {['Retratos de Mascotas', 'Pintura al Óleo', 'Acrílico', 'Crochet/Amigurumi', 'Bodegones Tropicales', 'Técnicas Mixtas'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sobre-mi">
                <Button size="lg">
                  Conocer Más
                </Button>
              </Link>
              <Link href="/servicios">
                <Button variant="outline" size="lg">
                  Ver Servicios
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/api/placeholder/500/600"
                alt="Artista en su estudio"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-200 rounded-full opacity-60 animate-float" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-200 rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-xl shadow-sm hover-lift">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {achievement.count}
              </div>
              <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
              <p className="text-gray-600 text-sm">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}