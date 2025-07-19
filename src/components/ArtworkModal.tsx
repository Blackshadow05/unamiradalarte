import { useState, useEffect } from 'react';
import type { Artwork, Review } from '../types';
import { cn } from '../lib/utils';
import ArtworkRatings from './ArtworkRatings';

interface ArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

// Datos de ejemplo de reseñas
const mockReviews: Review[] = [
  {
    id: '1',
    artworkId: '1',
    userName: 'María González',
    rating: 5,
    comment: 'Una obra absolutamente impresionante. Los colores transmiten una profundidad emocional increíble. Cada vez que la veo descubro nuevos detalles.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    artworkId: '1',
    userName: 'Carlos Ruiz',
    rating: 4,
    comment: 'Me encanta la técnica utilizada. Se nota la maestría de la artista en cada pincelada.',
    date: '2024-01-10',
    verified: false
  },
  {
    id: '3',
    artworkId: '2',
    userName: 'Ana Martín',
    rating: 5,
    comment: 'La acuarela fluye con una naturalidad asombrosa. Es como ver música convertida en color.',
    date: '2024-01-20',
    verified: true
  },
  {
    id: '4',
    artworkId: '2',
    userName: 'Pedro López',
    rating: 4,
    comment: 'Hermosa composición. Los tonos cálidos y fríos crean un equilibrio perfecto.',
    date: '2024-01-12',
    verified: false
  },
  {
    id: '5',
    artworkId: '3',
    userName: 'Laura Fernández',
    rating: 5,
    comment: 'Una reflexión profunda sobre la vida urbana. Me transporta a las calles de la ciudad.',
    date: '2024-01-18',
    verified: true
  },
  {
    id: '6',
    artworkId: '4',
    userName: 'Miguel Torres',
    rating: 4,
    comment: 'La serenidad que transmite esta obra es increíble. Perfecta para un espacio de meditación.',
    date: '2024-01-14',
    verified: false
  },
  {
    id: '7',
    artworkId: '5',
    userName: 'Carmen Vega',
    rating: 5,
    comment: 'Pura pasión convertida en arte. Los rojos y naranjas vibran con vida propia.',
    date: '2024-01-16',
    verified: true
  },
  {
    id: '8',
    artworkId: '6',
    userName: 'Roberto Silva',
    rating: 4,
    comment: 'La textura y los materiales naturales añaden una dimensión única a la obra.',
    date: '2024-01-13',
    verified: false
  },
  {
    id: '9',
    artworkId: '7',
    userName: 'Sofía Ramírez',
    rating: 5,
    comment: '¡Mi hija está enamorada de este osito! La calidad del tejido es excepcional y es súper suave.',
    date: '2024-01-22',
    verified: true
  },
  {
    id: '10',
    artworkId: '7',
    userName: 'Andrea Morales',
    rating: 5,
    comment: 'Perfecto para regalar. El acabado es impecable y se nota el amor con que está hecho.',
    date: '2024-01-19',
    verified: false
  },
  {
    id: '11',
    artworkId: '8',
    userName: 'Patricia Jiménez',
    rating: 5,
    comment: 'Las orejas largas son adorables y la cola pompón es un detalle encantador. ¡Hermoso trabajo!',
    date: '2024-01-21',
    verified: true
  },
  {
    id: '12',
    artworkId: '8',
    userName: 'Luis Vargas',
    rating: 4,
    comment: 'Excelente calidad de materiales. Mi sobrina no se separa de él.',
    date: '2024-01-17',
    verified: false
  },
  {
    id: '13',
    artworkId: '9',
    userName: 'Gabriela Castro',
    rating: 5,
    comment: 'Los detalles bordados son preciosos. La cola curvada le da mucha personalidad.',
    date: '2024-01-20',
    verified: true
  },
  {
    id: '14',
    artworkId: '9',
    userName: 'Fernando Solís',
    rating: 5,
    comment: 'Compré este gatito para mi esposa y le encantó. La artesanía es de primera calidad.',
    date: '2024-01-16',
    verified: false
  }
];

export default function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (artwork) {
      // Filtrar reseñas para la obra actual
      setReviews(mockReviews.filter(review => review.artworkId === artwork.id));
    }
  }, [artwork]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userRating || !comment.trim() || !userName.trim()) {
      if (typeof window !== 'undefined') {
        alert('Por favor completa todos los campos');
      }
      return;
    }

    // Función auxiliar para obtener la fecha como string
    const getCurrentDate = (): string => {
      const now = new Date();
      return now.toISOString().substring(0, 10);
    };

    const newReview: Review = {
      id: Date.now().toString(),
      artworkId: artwork?.id || '',
      userName: userName.trim(),
      rating: userRating,
      comment: comment.trim(),
      date: getCurrentDate(),
      verified: false
    };

    setReviews(prev => [newReview, ...prev]);
    
    // Reset form
    setUserRating(0);
    setComment('');
    setUserName('');
    
    if (typeof window !== 'undefined') {
      alert('¡Gracias por tu reseña!');
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            className={cn(
              size,
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default',
              star <= (interactive ? (hoverRating || userRating) : rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            )}
            onClick={interactive ? () => setUserRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            disabled={!interactive}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto art-shadow">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gray-50 flex items-center justify-center">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-64 lg:h-full max-h-[600px] object-contain p-4 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
              />
              
              {/* Status Badge */}
              {!artwork.available && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Vendida
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  {artwork.title}
                </h2>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                    {artwork.category === 'oleo' ? 'Óleo' : 
                     artwork.category === 'acuarela' ? 'Acuarela' :
                     artwork.category === 'mixta' ? 'Técnica Mixta' :
                     artwork.category === 'amigurumi' ? 'Amigurumi' : 'Pintura'}
                  </span>
                  <span>{artwork.year}</span>
                  <span>{artwork.dimensions}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(artwork.rating || 0)}
                  <span className="text-sm text-gray-600">
                    ({artwork.totalRatings || reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </div>

                {artwork.price && (
                  <div className="text-2xl font-bold text-primary-600 mb-4">
                    ₡{artwork.price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {artwork.description}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                {artwork.technique && (
                  <div>
                    <span className="font-semibold text-gray-900">Técnica:</span>
                    <p className="text-gray-600">{artwork.technique}</p>
                  </div>
                )}
                
                {artwork.materials && (
                  <div>
                    <span className="font-semibold text-gray-900">Materiales:</span>
                    <p className="text-gray-600">{artwork.materials.join(', ')}</p>
                  </div>
                )}
                
                {artwork.inspiration && (
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-gray-900">Inspiración:</span>
                    <p className="text-gray-600">{artwork.inspiration}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button className="flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">
                  Consultar Precio
                </button>
                <button className="flex-1 border-2 border-primary-600 text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-primary-600 hover:text-white transition-colors">
                  Compartir
                </button>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <ArtworkRatings 
                  artworkId={artwork.id} 
                  artworkTitle={artwork.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}