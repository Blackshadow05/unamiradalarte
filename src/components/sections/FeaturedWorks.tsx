'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArtworkDetail } from '@/components/sections/ArtworkDetail';
import { getObrasDestacadas, getArtworkRatings, addArtworkRating, getArtworkRatingStats } from '@/lib/supabase';
import { GaleriaItem, Artwork, Review, ReviewForm, ArtworkRating } from '@/types';
import { Brush, Clock, Calendar, Palette } from 'lucide-react';

// Extensión local del tipo para acceder a nuevas columnas opcionales
type GaleriaItemWithImages = GaleriaItem & {
  Imagen_horizontal?: string | null;
  Imagen_vertitical?: string | null;
};

// Función para convertir ArtworkRating a Review
function convertRatingToReview(rating: ArtworkRating): Review {
  return {
    id: rating.id.toString(),
    artworkId: rating.artwork_id,
    userName: rating.user_name || 'Usuario Anónimo',
    rating: rating.rating,
    comment: rating.comment || '',
    date: rating.created_at ? new Date(rating.created_at).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Fecha no disponible',
    verified: rating.verified || false,
  };
}

// Función para convertir GaleriaItem a Artwork (con estadísticas opcionales)
function convertGaleriaToArtwork(galeriaItem: GaleriaItem & { averageRating?: number; totalReviews?: number }): Artwork {
  const parsePrice = (precio: string | null): number => {
    if (!precio) return 0;
    const numericPrice = parseFloat(precio.replace(/[^\d.-]/g, ''));
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  return {
    id: galeriaItem.id.toString(),
    title: galeriaItem.Nombre_obra || 'Sin título',
    description: galeriaItem.Descripcion || 'Sin descripción disponible',
    price: parsePrice(galeriaItem.Precio),
    image: galeriaItem.image_gallery || galeriaItem.image_thumbnail || galeriaItem.image || '/api/placeholder/400/300',
    category: 'destacadas' as const,
    featured: true,
    dimensions: galeriaItem.Dimensiones || 'No especificado',
    year: galeriaItem.Año || new Date().getFullYear(),
    technique: galeriaItem.Tecnica || 'Técnica mixta',
    materials: galeriaItem.Materiales ? galeriaItem.Materiales.split(',').map(m => m.trim()) : ['Materiales varios'],
    inspiration: galeriaItem.Inspiracion || 'Esta obra refleja mi pasión por el arte y la creatividad.',
    creationTime: galeriaItem.Tiempo_creacion || 'Tiempo variable',
    rating: galeriaItem.averageRating || 0, // Usar rating real o 0 si no hay reseñas
    reviewCount: galeriaItem.totalReviews || 0, // Usar conteo real o 0 si no hay reseñas
    status: (galeriaItem.Estado?.toLowerCase() as 'disponible' | 'vendida' | 'reservada') || 'disponible',
  };
}

// Mock reviews para las obras
const generateMockReviews = (artworkId: string): Review[] => {
  const reviewTemplates = [
    { userName: 'María González', comment: 'Una obra increíble, los detalles son impresionantes. Se nota el amor y dedicación del artista.', rating: 5 },
    { userName: 'Carlos Rodríguez', comment: 'Hermoso trabajo, captura perfectamente la esencia. Muy recomendado.', rating: 5 },
    { userName: 'Ana Jiménez', comment: 'Excelente calidad y acabado. Superó mis expectativas completamente.', rating: 4 },
    { userName: 'Luis Morales', comment: 'Una pieza única que transmite mucha emoción. Felicitaciones al artista.', rating: 5 },
    { userName: 'Sofia Vargas', comment: 'Me encanta el estilo y la técnica utilizada. Una obra muy expresiva.', rating: 4 },
  ];

  const numReviews = Math.floor(Math.random() * 3) + 2; // Entre 2 y 4 reseñas
  const selectedReviews = reviewTemplates.slice(0, numReviews);

  return selectedReviews.map((review, index) => ({
    id: `${artworkId}-${index}`,
    artworkId,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    verified: Math.random() > 0.5,
  }));
};

export function FeaturedWorks() {
  const [obras, setObras] = useState<GaleriaItemWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});

  useEffect(() => {
    async function fetchObrasDestacadas() {
      try {
        setLoading(true);
        // Traer obras destacadas desde supabase (puede traer todas)
        const data = await getObrasDestacadas();

        // Filtrar por categoría "Obras Destacadas"
        const soloDestacadas = (data || []).filter(
          (obra) => (obra.Categoria || '').toLowerCase() === 'obras destacadas'
        );
        
        // Cargar reseñas reales y estadísticas para cada obra
        const realReviews: { [key: string]: Review[] } = {};
        const updatedObras = await Promise.all(
          (soloDestacadas as GaleriaItemWithImages[]).map(async (obra) => {
            const artworkId = obra.id.toString();
            
            // Obtener reseñas reales
            const ratings = await getArtworkRatings(artworkId);
            realReviews[artworkId] = ratings.map(convertRatingToReview);
            
            // Obtener estadísticas reales
            const stats = await getArtworkRatingStats(artworkId);
            
            return {
              ...obra,
              averageRating: stats.averageRating,
              totalReviews: stats.totalReviews
            };
          })
        );
        
        setObras(updatedObras);
        setReviews(realReviews);
      } catch (err) {
        console.error('Error al cargar obras destacadas:', err);
        setError('Error al cargar las obras destacadas');
      } finally {
        setLoading(false);
      }
    }

    fetchObrasDestacadas();
  }, []);

  const handleViewArtwork = (obra: GaleriaItem) => {
    // Asegurar que el modal use las nuevas columnas de imagen si existen
    const obraWithImgs = obra as GaleriaItemWithImages;
    const artwork = {
      ...convertGaleriaToArtwork(obra as any),
      image:
        obraWithImgs.Imagen_horizontal ||
        obraWithImgs.Imagen_vertitical ||
        obra.image_gallery ||
        obra.image_thumbnail ||
        obra.image ||
        '/api/placeholder/400/300',
      // URL vertical para móviles si existe
      verticalUrl: obraWithImgs.Imagen_vertitical || null,
      // Mantener featured=true para esta sección
      featured: true as const,
      category: 'destacadas' as const,
    } as unknown as Artwork & { verticalUrl?: string | null };
    setSelectedArtwork(artwork);
  };

  const handleAddReview = async (artworkId: string, reviewForm: ReviewForm) => {
    try {
      // Guardar reseña en la base de datos
      const savedRating = await addArtworkRating({
        artwork_id: artworkId,
        user_name: reviewForm.userName,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      if (savedRating) {
        // Convertir la reseña guardada al formato Review
        const newReview = convertRatingToReview(savedRating);

        // Actualizar el estado local
        setReviews(prev => ({
          ...prev,
          [artworkId]: [...(prev[artworkId] || []), newReview],
        }));

        // Actualizar las estadísticas de la obra
        const stats = await getArtworkRatingStats(artworkId);
        setObras(prev => prev.map(obra => 
          obra.id.toString() === artworkId 
            ? { ...obra, averageRating: stats.averageRating, totalReviews: stats.totalReviews }
            : obra
        ));

        console.log('✅ Reseña guardada exitosamente');
      } else {
        console.error('❌ Error al guardar la reseña');
      }
    } catch (error) {
      console.error('❌ Error al procesar la reseña:', error);
    }
  };

  const formatPrice = (precio: string | null) => {
    if (!precio) return 'Consultar precio';
    
    // Si el precio ya tiene formato de moneda, devolverlo tal como está
    if (precio.includes('₡') || precio.includes('$')) {
      return precio;
    }
    
    // Si es un número, formatearlo como colones
    const numericPrice = parseFloat(precio.replace(/[^\d.-]/g, ''));
    if (!isNaN(numericPrice)) {
      return `₡${numericPrice.toLocaleString('es-CR')}`;
    }
    
    return precio;
  };

  if (loading) {
    return (
      <section id="obras-destacadas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Obras <span className="text-gradient">Destacadas</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="obras-destacadas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Obras <span className="text-gradient">Destacadas</span>
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="obras-destacadas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Obras <span className="text-gradient">Destacadas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre mi colección de obras más representativas, cada una creada con 
            pasión y dedicación para capturar la esencia única de cada sujeto.
          </p>
        </div>

        {obras.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay obras destacadas disponibles en este momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {obras.slice(0, 6).map((obra) => (
                <Card key={obra.id} className="overflow-hidden hover-lift">
                  <div className="relative">
                    <Image
                      src={(obra as GaleriaItemWithImages).Imagen_horizontal || (obra as GaleriaItemWithImages).Imagen_vertitical || obra.image_gallery || obra.image_thumbnail || obra.image || '/api/placeholder/400/300'}
                      alt={obra.Nombre_obra || 'Obra sin título'}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    {obra.Estado === 'vendida' && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        Vendida
                      </div>
                    )}
                    {obra.Estado === 'reservada' && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                        Reservada
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {obra.Nombre_obra || 'Obra sin título'}
                      </h3>
                      <span className="text-lg font-bold text-primary-500 whitespace-nowrap ml-2">
                        {formatPrice(obra.Precio)}
                      </span>
                    </div>

                    {obra.Descripcion && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{obra.Descripcion}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {obra.Tecnica && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Brush className="h-4 w-4 mr-2" />
                          {obra.Tecnica}
                        </div>
                      )}
                      
                      {obra.Año && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {obra.Año}
                        </div>
                      )}
                      
                      {obra.Dimensiones && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Palette className="h-4 w-4 mr-2" />
                          {obra.Dimensiones}
                        </div>
                      )}
                      
                      {obra.Tiempo_creacion && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {obra.Tiempo_creacion}
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full" 
                      disabled={obra.Estado === 'vendida'}
                      onClick={() => handleViewArtwork(obra)}
                    >
                      {obra.Estado === 'vendida' ? 'Vendida' : 'Ver Detalles'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                ¿Quieres ver toda mi galería de obras?
              </p>
              <Link href="/galeria">
                <Button size="lg" className="px-8">
                  Ver Galería Completa
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Modal de detalles de obra */}
      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          isOpen={!!selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          reviews={reviews[selectedArtwork.id] || []}
          onAddReview={(reviewForm) => handleAddReview(selectedArtwork.id, reviewForm)}
        />
      )}
    </section>
  );
}