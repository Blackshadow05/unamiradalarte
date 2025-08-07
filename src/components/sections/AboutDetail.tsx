import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Palette, Users, Calendar, Heart, Award, MapPin } from 'lucide-react';

const achievements = [
  {
    icon: Palette,
    title: 'Técnicas Dominadas',
    description: 'Óleo, acrílico, crochet y técnicas mixtas',
    count: '5+',
  },
  {
    icon: Users,
    title: 'Retratos Realizados',
    description: 'Mascotas inmortalizadas con amor y dedicación',
    count: '200+',
  },
  {
    icon: Calendar,
    title: 'Años de Experiencia',
    description: 'Dedicación constante al arte y los retratos',
    count: '3+',
  },
  {
    icon: Heart,
    title: 'Familias Felices',
    description: 'Clientes satisfechos con sus retratos',
    count: '150+',
  },
];

const timeline = [
  {
    year: '2021',
    title: 'Inicios en el Arte',
    description: 'Comencé mi journey artístico explorando diferentes técnicas de pintura, especialmente el óleo y acrílico.',
  },
  {
    year: '2022',
    title: 'Especialización en Retratos',
    description: 'Descubrí mi pasión por los retratos de mascotas y comencé a perfeccionar esta técnica única.',
  },
  {
    year: '2023',
    title: 'Expansión al Amigurumi',
    description: 'Incorporé el crochet y amigurumi a mi repertorio, creando figuras tiernas de la fauna costarricense.',
  },
  {
    year: '2024',
    title: 'Una Mirada al Arte',
    description: 'Lancé mi marca personal y galería digital, consolidando mi presencia en el mundo artístico.',
  },
];

export function AboutDetail() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Spacing for content after PageHero */}
        <div className="mb-16"></div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-primary-500 mr-2" />
              <span className="text-lg text-gray-600">San José, Costa Rica</span>
            </div>

            <h2 className="text-3xl font-bold mb-6">Mi Historia</h2>

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
              <h3 className="text-xl font-bold mb-4">Mis Especialidades</h3>
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
              <Button size="lg">
                Ver Mi Galería
              </Button>
              <Button variant="outline" size="lg">
                Solicitar Retrato
              </Button>
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

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Mi Trayectoria Artística</h3>
            <p className="text-lg text-gray-600">
              Un recorrido por los momentos más importantes de mi carrera artística
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="p-6">
                      <div className="text-2xl font-bold text-primary-500 mb-2">{item.year}</div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Mis Logros</h3>
            <p className="text-lg text-gray-600">
              Números que reflejan mi dedicación y el amor por lo que hago
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="text-center p-8 hover-lift">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary-500" />
                  </div>
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {achievement.count}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Philosophy */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-primary-50 to-accent-50">
            <h3 className="text-2xl font-bold mb-6">Mi Filosofía Artística</h3>
            <blockquote className="text-xl md:text-2xl font-light text-gray-700 italic mb-6">
              &ldquo;Cada mascota tiene una personalidad única que merece ser inmortalizada con amor y dedicación.
              Mi arte no solo captura su apariencia, sino su alma y el vínculo especial que comparten con sus familias.&rdquo;
            </blockquote>
            <cite className="text-lg text-primary-500 font-medium">
              — Una Mirada al Arte
            </cite>
          </Card>
        </div>
      </div>
    </section>
  );
}