'use client';

import { Button } from '@/components/ui/Button';
import { ArrowDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient animation */}
      <div className="absolute inset-0 gradient-animation opacity-10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full animate-float opacity-60" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent-200 rounded-full animate-float opacity-60" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary-300 rounded-full animate-float opacity-60" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-blur">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary-500 mr-2" />
            <span className="text-primary-500 font-medium text-lg">Arte Personalizado</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Donde la{' '}
            <span className="text-gradient">creatividad</span>
            <br />
            cobra vida
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Especializada en retratos de mascotas, bodegones y amigurumi. 
            Cada obra captura la esencia y personalidad única de tu compañero fiel.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/galeria">
              <Button 
                size="lg" 
                className="px-8 py-4"
              >
                Explorar Galería
              </Button>
            </Link>
            <Link href="/sobre-mi">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4"
              >
                Conocer a la Artista
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">200+</div>
              <div className="text-gray-600">Retratos de Mascotas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">7</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">150+</div>
              <div className="text-gray-600">Familias Felices</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <button 
        onClick={() => scrollToSection('galeria')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Scroll to gallery"
      >
        <ArrowDown className="h-6 w-6 text-gray-400 hover:text-primary-500 transition-colors" />
      </button>
    </section>
  );
}