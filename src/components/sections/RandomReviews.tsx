'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { getArtworkRatings } from '@/lib/supabase';
import { ArtworkRating } from '@/types';
import { Quote, User, Sparkles } from 'lucide-react';

interface ReviewWithArtwork extends ArtworkRating {
  artwork_title?: string;
}

export function RandomReviews() {
  const [reviews, setReviews] = useState<ReviewWithArtwork[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<ReviewWithArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cargar todas las reseñas al inicio
  useEffect(() => {
    async function loadAllReviews() {
      try {
        setLoading(true);
        
        // Obtener reseñas de diferentes obras (simulando IDs de obras)
        const artworkIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const allReviews: ReviewWithArtwork[] = [];
        
        for (const artworkId of artworkIds) {
          const artworkReviews = await getArtworkRatings(artworkId);
          const reviewsWithTitle = artworkReviews.map(review => ({
            ...review,
            artwork_title: getArtworkTitle(artworkId)
          }));
          allReviews.push(...reviewsWithTitle);
        }
        
        // Si no hay reseñas reales, usar algunas de ejemplo
        if (allReviews.length === 0) {
          allReviews.push(...getMockReviews());
        }
        
        setReviews(allReviews);
        setDisplayedReviews(getRandomReviews(allReviews, 6));
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
        setReviews(getMockReviews());
        setDisplayedReviews(getRandomReviews(getMockReviews(), 6));
      } finally {
        setLoading(false);
      }
    }

    loadAllReviews();
  }, []);

  // Cambiar reseñas cada 12s con transición aún más suave (fade + translate sutil)
  useEffect(() => {
    if (reviews.length === 0) return;

    const interval = setInterval(() => {
      // Iniciar animación de desvanecimiento
      setIsTransitioning(true);

      // Después de que se desvanezca completamente, cambiar las reseñas
      const fadeOutDuration = 900;   // ms
      const domUpdateDelay  = 80;    // ms
      setTimeout(() => {
        setDisplayedReviews(getRandomReviews(reviews, 6));
        setAnimationKey(prev => prev + 1);

        // Después de cambiar las reseñas, iniciar animación de aparición
        setTimeout(() => {
          setIsTransitioning(false);
        }, domUpdateDelay);
      }, fadeOutDuration);
    }, 12000); // un poco más de tiempo para lectura cómoda

    return () => clearInterval(interval);
  }, [reviews]);

  // Función para obtener reseñas aleatorias
  const getRandomReviews = (allReviews: ReviewWithArtwork[], count: number): ReviewWithArtwork[] => {
    const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  // Función para obtener título de obra (simulado)
  const getArtworkTitle = (artworkId: string): string => {
    const titles: { [key: string]: string } = {
      '1': 'Bella - Golden Retriever',
      '2': 'Orquídeas de Costa Rica',
      '3': 'Colibríes Amigurumi',
      '4': 'Max - Pastor Alemán',
      '5': 'Paisaje Volcánico',
      '6': 'Luna - Gata Persa',
      '7': 'Mariposas Tropicales',
      '8': 'Cactus en Maceta',
      '9': 'Tucán Amigurumi',
      '10': 'Atardecer en Manuel Antonio'
    };
    return titles[artworkId] || 'Obra de Arte';
  };

  // Función para abrir la página de todas las reseñas
  const handleViewAllReviews = () => {
    window.open('/ratings', '_blank');
  };

  // Reseñas de ejemplo si no hay reales
  const getMockReviews = (): ReviewWithArtwork[] => [
    {
      id: 1,
      artwork_id: '1',
      user_name: 'María González',
      user_email: null,
      rating: 5,
      comment: 'Increíble trabajo! El retrato de mi mascota quedó perfecto, capturó su personalidad completamente.',
      verified: true,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-15T10:30:00',
      updated_at: '2024-01-15T10:30:00',
      artwork_title: 'Bella - Golden Retriever'
    },
    {
      id: 2,
      artwork_id: '2',
      user_name: 'Carlos Rodríguez',
      user_email: null,
      rating: 5,
      comment: 'Las orquídeas se ven tan reales que parece que puedo oler su fragancia. Una obra maestra.',
      verified: false,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-14T15:45:00',
      updated_at: '2024-01-14T15:45:00',
      artwork_title: 'Orquídeas de Costa Rica'
    },
    {
      id: 3,
      artwork_id: '3',
      user_name: 'Ana Jiménez',
      user_email: null,
      rating: 5,
      comment: 'Los colibríes amigurumi son adorables! Mi hija los ama. Excelente calidad y muy tiernos.',
      verified: true,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-13T09:20:00',
      updated_at: '2024-01-13T09:20:00',
      artwork_title: 'Colibríes Amigurumi'
    },
    {
      id: 4,
      artwork_id: '4',
      user_name: 'Luis Morales',
      user_email: null,
      rating: 4,
      comment: 'Hermoso paisaje que refleja la belleza natural de Costa Rica. Los colores son vibrantes.',
      verified: false,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-12T14:10:00',
      updated_at: '2024-01-12T14:10:00',
      artwork_title: 'Paisaje Volcánico'
    },
    {
      id: 5,
      artwork_id: '5',
      user_name: 'Sofia Vargas',
      user_email: null,
      rating: 5,
      comment: 'Una pieza única que transmite mucha emoción. Se nota el amor en cada detalle.',
      verified: true,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-11T16:55:00',
      updated_at: '2024-01-11T16:55:00',
      artwork_title: 'Luna - Gata Persa'
    },
    {
      id: 6,
      artwork_id: '6',
      user_name: 'Patricia Vega',
      user_email: null,
      rating: 5,
      comment: 'Las mariposas parecen estar a punto de volar. Un trabajo delicado y hermoso.',
      verified: false,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-10T11:30:00',
      updated_at: '2024-01-10T11:30:00',
      artwork_title: 'Mariposas Tropicales'
    },
    {
      id: 7,
      artwork_id: '7',
      user_name: 'Roberto Sánchez',
      user_email: null,
      rating: 4,
      comment: 'Me encanta el estilo minimalista. Perfecto para decorar mi oficina.',
      verified: false,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-09T13:25:00',
      updated_at: '2024-01-09T13:25:00',
      artwork_title: 'Cactus en Maceta'
    },
    {
      id: 8,
      artwork_id: '8',
      user_name: 'Elena Castillo',
      user_email: null,
      rating: 5,
      comment: 'El tucán amigurumi es precioso! Representa muy bien nuestra fauna costarricense.',
      verified: true,
      ip_address: null,
      user_agent: null,
      created_at: '2024-01-08T17:40:00',
      updated_at: '2024-01-08T17:40:00',
      artwork_title: 'Tucán Amigurumi'
    }
  ];

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Lo que dicen nuestros <span className="text-gradient">clientes</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary-500 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Lo que dicen nuestros <span className="text-gradient">clientes</span>
            </h2>
            <Sparkles className="h-8 w-8 text-primary-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testimonios reales de clientes satisfechos que han confiado en nuestro arte
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {displayedReviews.map((review, index) => (
            <div
              key={`${review.id}-${animationKey}-${index}`}
              className={`relative overflow-hidden hover-lift group transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isTransitioning
                  ? 'opacity-0 translate-y-3'
                  : 'opacity-100 translate-y-0'
              }`}
              style={{
                transitionDelay: isTransitioning ? `${index * 50}ms` : `${index * 70}ms`
              }}
            >
              <Card className="relative">
              {/* Decorative quote */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Quote className="h-12 w-12 text-primary-500" />
              </div>

              {/* Verified badge */}
              {review.verified && (
                <div className="absolute top-4 left-4 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verificado
                </div>
              )}

              <div className="p-6">
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={review.rating} readonly size="sm" />
                </div>

                {/* Comment */}
                <blockquote className="text-gray-700 mb-6 line-clamp-4 italic">
                  "{review.comment}"
                </blockquote>

                {/* User info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.user_name || 'Usuario Anónimo'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </div>

                {/* Artwork info */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Obra: <span className="font-medium text-primary-600">{review.artwork_title}</span>
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            </div>
          ))}
        </div>

        {/* Botón para ver todas las reseñas */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            ¿Quieres leer más opiniones de nuestros clientes?
          </p>
          <button
            onClick={handleViewAllReviews}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ver Todas las Calificaciones
          </button>
        </div>

        {/* Floating animation indicators: suavizados */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${
                  isTransitioning
                    ? 'bg-accent-400 gentle-pulse'
                    : 'bg-primary-500 gentle-pulse'
                }`}
                style={{
                  animationDelay: `${i * 300}ms`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Animación suave para los indicadores pulsantes */
        @keyframes gentle-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-pulse {
          animation: gentle-pulse 2s ease-in-out infinite;
        }

        /* Eliminamos transiciones globales en * para evitar sensación brusca por cascada */
        
        .gentle-pulse {
          animation: gentle-pulse 2.2s ease-in-out infinite;
        }

        /* Mantener efecto hover-lift pero sin exagerar */
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}