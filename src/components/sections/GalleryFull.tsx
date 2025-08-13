'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { ArtworkDetail } from '@/components/sections/ArtworkDetail';
import { cn, formatPrice } from '@/lib/utils';
import { Artwork } from '@/types';
import { Eye, Heart, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { getGaleriaItems, GaleriaItem } from '@/lib/supabase-queries';
import { getArtworkRatings, addArtworkRating, getArtworkRatingStats, convertArtworkRatingToReview } from '@/lib/supabase';
import { Review, ReviewForm, ArtworkRating } from '@/types';
import { GalleryFilters } from './GalleryFilters';

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

// Función para convertir datos de Supabase al formato Artwork
function convertGaleriaToArtwork(galeriaItem: GaleriaItem & { averageRating?: number; totalReviews?: number }): Artwork {
  const parsePrice = (precio: string | number | null): number => {
    if (precio === null || precio === undefined) return 0;
    if (typeof precio === 'number') return isNaN(precio) ? 0 : precio;
    const numericPrice = parseFloat(precio.replace(/[^\d.-]/g, ''));
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  return {
    id: galeriaItem.id.toString(),
    title: galeriaItem.Nombre_obra || 'Sin título',
    description: galeriaItem.Descripcion || 'Sin descripción',
    price: parsePrice(galeriaItem.Precio as any), // Convertir precio correctamente (DB text o number)
    image: galeriaItem.Imagen_horizontal || galeriaItem.Imagen_vertitical || galeriaItem.image_gallery || galeriaItem.image || '/api/placeholder/400/500',
    category: (galeriaItem.Categoria?.toLowerCase() as any) || 'general',
    featured: galeriaItem.Categoria === 'Obras Destacadas', // Marcar como destacada si es de esa categoría
    dimensions: galeriaItem.Dimensiones || '',
    year: galeriaItem.Año || new Date().getFullYear(),
    technique: galeriaItem.Tecnica || '',
    materials: galeriaItem.Materiales ? galeriaItem.Materiales.split(',').map(m => m.trim()) : [],
    inspiration: galeriaItem.Inspiracion || '',
    creationTime: galeriaItem.Tiempo_creacion || '',
    rating: galeriaItem.averageRating || 0, // Usar rating real o 0 si no hay reseñas
    reviewCount: galeriaItem.totalReviews || 0, // Usar conteo real o 0 si no hay reseñas
    status: (((galeriaItem.Estado?.toLowerCase() ?? 'disponible') === 'vendido' || (galeriaItem.Estado?.toLowerCase() ?? 'disponible') === 'vendida') ? 'vendida' : (galeriaItem.Estado?.toLowerCase() === 'de cliente' ? 'de cliente' : 'disponible')) as 'disponible' | 'vendida' | 'de cliente',
  };
}


const ITEMS_PER_PAGE = 15;

export function GalleryFull({ showFilters = true, featuredOnly = false }: { showFilters?: boolean; featuredOnly?: boolean }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('todas');
    const [selectedEstado, setSelectedEstado] = useState<string>('todos');
    const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});

    // Cargar obras desde Supabase
    useEffect(() => {
        loadArtworks();
    }, []);

    const loadArtworks = async () => {
        try {
            setLoading(true);
            console.log('🎨 Cargando obras desde Supabase...');
            
            const galeriaItems = await getGaleriaItems();
            console.log(`✅ ${galeriaItems.length} obras cargadas desde la base de datos`);
            
            // Cargar reseñas y estadísticas para cada obra
            const realReviews: { [key: string]: Review[] } = {};
            const artworksWithStats = await Promise.all(
                galeriaItems.map(async (item) => {
                    const artworkId = item.id.toString();
                    
                    // Obtener reseñas reales
                    const ratings = await getArtworkRatings(artworkId);
                    realReviews[artworkId] = ratings.map(convertArtworkRatingToReview);
                    
                    // Obtener estadísticas reales
                    const stats = await getArtworkRatingStats(artworkId);
                    
                    // Convertir a Artwork con estadísticas reales
                    const artwork = convertGaleriaToArtwork(item);
                    return {
                        ...artwork,
                        rating: stats.averageRating || 4.5,
                        reviewCount: stats.totalReviews || 0
                    };
                })
            );
            
            setAllArtworks(artworksWithStats);
            setReviews(realReviews);
            setError(null);
        } catch (err) {
            console.error('❌ Error al cargar obras:', err);
            setError('Error al cargar las obras. Mostrando contenido de ejemplo.');
            // Usar datos de fallback en caso de error
            setAllArtworks(fallbackArtworks);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar obras por categoría, estado y opcionalmente solo destacadas
    const filteredArtworks = allArtworks.filter(artwork => {
        // Si se solicitó solo obras destacadas, ignorar las que no lo sean
        if (featuredOnly && !artwork.featured) return false;

        const matchesCategory = selectedCategory === 'todas' || artwork.category === selectedCategory;
        const matchesEstado = selectedEstado === 'todos' ||
            (selectedEstado === 'disponible' && artwork.status === 'disponible') ||
            (selectedEstado === 'vendida' && artwork.status === 'vendida');
        return matchesCategory && matchesEstado;
    });

    // Calcular paginación
    const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArtworks = filteredArtworks.slice(startIndex, endIndex);

    // Obtener categorías únicas
    const categories = ['todas', ...Array.from(new Set(allArtworks.map(artwork => artwork.category)))];

    const toggleFavorite = (id: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
    };

    const handleViewArtwork = (artwork: Artwork) => {
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
                const newReview = convertArtworkRatingToReview(savedRating);

                // Actualizar el estado local
                setReviews(prev => ({
                    ...prev,
                    [artworkId]: [...(prev[artworkId] || []), newReview],
                }));

                // Actualizar las estadísticas de la obra
                const stats = await getArtworkRatingStats(artworkId);
                setAllArtworks(prev => prev.map(artwork => 
                    artwork.id === artworkId 
                        ? { ...artwork, rating: stats.averageRating, reviewCount: stats.totalReviews }
                        : artwork
                ));

                console.log('✅ Reseña guardada exitosamente en galería completa');
            } else {
                console.error('❌ Error al guardar la reseña');
            }
        } catch (error) {
            console.error('❌ Error al agregar reseña:', error);
        }
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when changing category
    };

    const handleEstadoChange = (estado: string) => {
        setSelectedEstado(estado);
        setCurrentPage(1); // Reset to first page when changing estado
        console.log('Estado cambiado a:', estado); // Debugging log
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Estado de carga
    if (loading) {
        return (
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Cargando galería...
                            </h3>
                            <p className="text-gray-600">
                                Obteniendo las obras más recientes
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Mostrar mensaje de error si existe */}
                {error && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                            <p className="text-yellow-800 text-sm">{error}</p>
                        </div>
                    </div>
                )}


                {/* Información de resultados */}
                <div className="mb-6 text-center">
                    <div className="text-gray-600 mb-2">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, filteredArtworks.length)} de {filteredArtworks.length} obras
                    </div>
                    {(selectedCategory !== 'todas' || selectedEstado !== 'todos') && (
                        <div className="text-sm text-gray-500">
                            Filtros activos: 
                            {selectedCategory !== 'todas' && (
                                <span className="ml-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                                    {selectedCategory}
                                </span>
                            )}
                            {selectedEstado !== 'todos' && (
                                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    {selectedEstado === 'disponible' ? 'Disponible' : 'Vendido'}
                                </span>
                            )}
                        </div>
                    )}
                </div>

{showFilters && (
  <GalleryFilters
    categories={categories}
    currentCategory={selectedCategory}
    onCategoryChange={handleCategoryChange}
    currentEstado={selectedEstado}
    onEstadoChange={handleEstadoChange}
  />
)}
            {/* Grid de obras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                {currentArtworks.map((artwork) => (
                    <div key={artwork.id} className="group relative p-[1px] rounded-xl transition-transform duration-300 hover:-translate-y-0.5">
                      <Card className="relative rounded-xl overflow-hidden bg-white shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                         {/* Imagen más ancha en móvil */}
                        <div className="relative overflow-hidden -mx-4 sm:mx-0">
                            <div className="w-full aspect-[4/3] relative">
                                <Image
                                    src={artwork.image}
                                    alt={artwork.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    quality={75}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k"
                                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleViewArtwork(artwork)}
                                        className="p-3 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-colors"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(artwork.id);
                                        }}
                                        className={cn(
                                            'p-3 rounded-full transition-colors',
                                            favorites.has(artwork.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 text-gray-900 hover:bg-white'
                                        )}
                                    >
                                        <Heart className={cn('h-5 w-5', favorites.has(artwork.id) && 'fill-current')} />
                                    </button>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {artwork.featured && (
                                    <div className="bg-primary-500/95 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                        Destacada
                                    </div>
                                )}
                                {artwork.status === 'vendida' && (
                                    <div className="bg-red-500/95 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                        Vendida
                                    </div>
                                )}
                                {artwork.status === 'disponible' && (
                                    <div className="bg-green-500/95 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                        Disponible
                                    </div>
                                )}
                                {artwork.status === 'de cliente' && (
                                    <div className="bg-blue-500/95 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                        De cliente
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{artwork.title}</h3>
                                {artwork.price > 0 && (
                                    <span className={cn(
                                        "text-lg font-bold",
                                        artwork.status === 'vendida' 
                                            ? 'text-gray-400 line-through' 
                                            : 'text-primary-500'
                                    )}>
                                        {formatPrice(artwork.price)}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 mb-3">
                                <StarRating rating={artwork.rating} readonly size="sm" />
                                <span className="text-sm text-gray-500">
                                    ({artwork.reviewCount})
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">{artwork.description}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span className="capitalize">{artwork.category}</span>
                                {artwork.dimensions && <span>{artwork.dimensions}</span>}
                                <span>{artwork.year}</span>
                            </div>
                            
                            {/* Estado de la obra */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    artwork.status === 'disponible' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                )}>
                                    {artwork.status === 'disponible' ? 'Disponible' : 'Vendida'}
                                </span>
                                {artwork.price > 0 && artwork.status === 'disponible' && (
                                    <span className="text-sm text-gray-600">
                                        Precio: {formatPrice(artwork.price)}
                                    </span>
                                )}
                            </div>

                          <Button
                            className={cn(
                              "w-full",
                              artwork.status === 'vendida' ? "bg-gray-400 hover:bg-gray-400" : ""
                            )}
                            onClick={() => handleViewArtwork(artwork)}
                          >
                            {artwork.status === 'vendida' ? '🔒 Obra Vendida' : '👁️ Ver Detalles'}
                          </Button>
                        </div>
                      </Card>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                currentPage === page
                                    ? 'bg-primary-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            )}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                        )}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
                )}
            </div>

            {/* Artwork Detail Modal */}
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