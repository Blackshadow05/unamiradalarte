import { useState, useEffect } from 'react';

interface Review {
  id: string;
  artworkId: string;
  artworkTitle: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const allReviews: Review[] = [
  {
    id: '1',
    artworkId: '1',
    artworkTitle: 'Susurros del Alma',
    userName: 'María González',
    rating: 5,
    comment: 'Una obra absolutamente impresionante. Los colores transmiten una profundidad emocional increíble.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    artworkId: '2',
    artworkTitle: 'Danza de Colores',
    userName: 'Ana Martín',
    rating: 5,
    comment: 'La acuarela fluye con una naturalidad asombrosa. Es como ver música convertida en color.',
    date: '2024-01-20',
    verified: true
  },
  {
    id: '3',
    artworkId: '7',
    artworkTitle: 'Osito Dulce',
    userName: 'Sofía Ramírez',
    rating: 5,
    comment: '¡Mi hija está enamorada de este osito! La calidad del tejido es excepcional y es súper suave.',
    date: '2024-01-22',
    verified: true
  },
  {
    id: '4',
    artworkId: '9',
    artworkTitle: 'Gatito Mimoso',
    userName: 'Gabriela Castro',
    rating: 5,
    comment: 'Los detalles bordados son preciosos. La cola curvada le da mucha personalidad.',
    date: '2024-01-20',
    verified: true
  },
  {
    id: '5',
    artworkId: '5',
    artworkTitle: 'Fuego Interior',
    userName: 'Carmen Vega',
    rating: 5,
    comment: 'Pura pasión convertida en arte. Los rojos y naranjas vibran con vida propia.',
    date: '2024-01-16',
    verified: true
  }
];

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === allReviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? allReviews.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === allReviews.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentReview = allReviews[currentIndex];

  // Safety check - should never happen but satisfies TypeScript
  if (!currentReview) {
    return <div>Error: No se pudo cargar la reseña</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-8 art-shadow max-w-2xl mx-auto">
      {/* Review Content */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {renderStars(currentReview.rating)}
        </div>
        
        <blockquote className="text-xl text-gray-700 leading-relaxed mb-6 italic">
          "{currentReview.comment}"
        </blockquote>
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h3 className="font-semibold text-gray-900">{currentReview.userName}</h3>
          {currentReview.verified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              ✓ Verificado
            </span>
          )}
        </div>
        
        <p className="text-sm text-primary-600 font-medium mb-1">{currentReview.artworkTitle}</p>
        <p className="text-xs text-gray-500">{formatDate(currentReview.date)}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 transition-colors duration-200"
          aria-label="Reseña anterior"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {allReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label={`Ir a reseña ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 transition-colors duration-200"
          aria-label="Siguiente reseña"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Auto-play indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400">
          {isAutoPlaying ? '⏸️ Pausa automática' : '▶️ Reproducción automática'} • 
          Reseña {currentIndex + 1} de {allReviews.length}
        </div>
      </div>
    </div>
  );
}