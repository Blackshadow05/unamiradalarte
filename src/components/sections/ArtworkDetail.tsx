'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { Card, CardContent } from '@/components/ui/Card';
import { cn, formatPrice } from '@/lib/utils';
import { Artwork, Review, ReviewForm } from '@/types';
import { 
  Calendar, 
  Palette, 
  Ruler, 
  Clock, 
  Heart, 
  Share2, 
  MessageCircle,
  User,
  CheckCircle
} from 'lucide-react';

interface ArtworkDetailProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (review: ReviewForm) => void;
}

export function ArtworkDetail({ 
  artwork, 
  isOpen, 
  onClose, 
  reviews,
  onAddReview 
}: ArtworkDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 5,
    comment: '',
    userName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName.trim() || !reviewForm.comment.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onAddReview(reviewForm);
    setReviewForm({ rating: 5, comment: '', userName: '' });
    setIsSubmitting(false);
  };

  const statusColors = {
    disponible: 'bg-green-100 text-green-800',
    vendida: 'bg-red-100 text-red-800',
    reservada: 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    disponible: 'Disponible',
    vendida: 'Vendida',
    reservada: 'Reservada',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6">
        {/* Image */}
        <div className="relative -mx-4 sm:mx-0">
          {/* Móvil: no adaptar al contenedor para evitar desbordes laterales; usar alto fijo y object-cover */}
          <div className="block sm:hidden">
            <Image
              src={(artwork as any).verticalUrl || artwork.image}
              alt={artwork.title}
              width={1200}
              height={1600}
              className="w-full h-[62vh] object-cover rounded-none shadow-lg"
              sizes="100vw"
              priority={false}
            />
          </div>
          {/* Desktop/Tablet: mantener imagen adaptativa con fill y object-contain */}
          <div className="hidden sm:block relative w-full" style={{ height: '500px' }}>
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="absolute inset-0 w-full h-full object-contain bg-black/5 rounded-xl shadow-lg"
              sizes="(max-width: 1024px) 50vw, 600px"
              priority={false}
            />
          </div>
          
          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              statusColors[artwork.status]
            )}>
              {statusLabels[artwork.status]}
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 px-1 sm:px-0">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <StarRating rating={artwork.rating} readonly showValue />
                <span className="text-sm text-gray-500">
                  ({artwork.reviewCount} reseñas)
                </span>
              </div>
              <div className="text-2xl font-bold text-primary-500">
                {formatPrice(artwork.price)}
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{artwork.description}</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Detalles' },
                { id: 'reviews', label: `Reseñas (${reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto max-h-64">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-500">Año</div>
                      <div className="font-medium">{artwork.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Ruler className="h-5 w-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-500">Dimensiones</div>
                      <div className="font-medium">{artwork.dimensions || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-500">Técnica</div>
                      <div className="font-medium">{artwork.technique}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-500">Tiempo de creación</div>
                      <div className="font-medium">{artwork.creationTime}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Materiales utilizados</h4>
                  <div className="flex flex-wrap gap-2">
                    {artwork.materials.map((material, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Inspiración</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {artwork.inspiration}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Add Review Form */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4">Escribir una reseña</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Calificación
                        </label>
                        <StarRating
                          rating={reviewForm.rating}
                          onRatingChange={(rating) => 
                            setReviewForm(prev => ({ ...prev, rating }))
                          }
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={reviewForm.userName}
                          onChange={(e) => 
                            setReviewForm(prev => ({ ...prev, userName: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Comentario
                        </label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => 
                            setReviewForm(prev => ({ ...prev, comment: e.target.value }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="Comparte tu opinión sobre esta obra..."
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        size="sm"
                      >
                        {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-500" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{review.userName}</span>
                                {review.verified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{review.date}</div>
                            </div>
                          </div>
                          <StarRating rating={review.rating} readonly size="sm" />
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {reviews.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay reseñas aún. ¡Sé el primero en comentar!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {artwork.status === 'disponible' && (
            <div className="flex space-x-4 pt-4 border-t border-gray-100">
              <Button className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Consultar Disponibilidad
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}