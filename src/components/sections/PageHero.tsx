'use client';

import { Sparkles } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge = 'Arte Personalizado' }: PageHeroProps) {
  return (
    <section className="relative py-32 flex items-center justify-center overflow-hidden">
      {/* Background with gradient animation */}
      <div className="absolute inset-0 gradient-animation opacity-10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full animate-float opacity-60" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent-200 rounded-full animate-float opacity-60" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-primary-300 rounded-full animate-float opacity-60" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-blur">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary-500 mr-2" />
            <span className="text-primary-500 font-medium text-lg">{badge}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {title.split(' ').map((word, index, array) => 
              index === array.length - 1 ? 
                <span key={index}><span className="text-gradient">{word}</span></span> : 
                <span key={index}>{word}{' '}</span>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}