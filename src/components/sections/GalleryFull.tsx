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
  const parsePrice = (precio: string | null): number => {
    if (!precio) return 0;
    const numericPrice = parseFloat(precio.replace(/[^\d.-]/g, ''));
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  return {
    id: galeriaItem.id.toString(),
    title: galeriaItem.Nombre_obra || 'Sin título',
    description: galeriaItem.Descripcion || 'Sin descripción',
    price: parsePrice(galeriaItem.Precio), // Convertir precio correctamente
    image: galeriaItem.image_gallery || galeriaItem.image || '/api/placeholder/400/500',
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
    status: (galeriaItem.Estado?.toLowerCase() as 'disponible' | 'vendida' | 'reservada') || 'disponible',
  };
}

// Datos de ejemplo para fallback (se reemplazarán con datos reales)
const fallbackArtworks: Artwork[] = [
    {
        id: '1',
        title: 'Bella - Golden Retriever',
        description: 'Retrato emotivo de Bella, una Golden Retriever con una sonrisa contagiosa que ilumina cualquier habitación.',
        price: 45000,
        image: '/api/placeholder/400/500',
        category: 'retratos',
        featured: true,
        dimensions: '40x50 cm',
        year: 2024,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo', 'Pinceles de detalle'],
        inspiration: 'Bella tiene una personalidad tan luminosa que quise capturar esa alegría pura que transmite a todos los que la conocen.',
        creationTime: '2 semanas',
        rating: 4.9,
        reviewCount: 24,
        status: 'disponible',
    },
    {
        id: '2',
        title: 'Orquídeas de Costa Rica',
        description: 'Exquisito bodegón con orquídeas nativas costarricenses, celebrando la diversidad floral de nuestro país.',
        price: 38000,
        image: '/api/placeholder/400/500',
        category: 'naturaleza',
        featured: true,
        dimensions: '45x60 cm',
        year: 2024,
        technique: 'Acrílico sobre lienzo',
        materials: ['Acrílico', 'Lienzo', 'Pinceles finos'],
        inspiration: 'Costa Rica alberga más de 1,400 especies de orquídeas. Quise rendir homenaje a esta increíble biodiversidad.',
        creationTime: '3 semanas',
        rating: 4.8,
        reviewCount: 16,
        status: 'disponible',
    },
    {
        id: '3',
        title: 'Colibríes Amigurumi',
        description: 'Pareja de colibríes tejidos a mano, representando la gracia y belleza de estas aves tan especiales para Costa Rica.',
        price: 22000,
        image: '/api/placeholder/400/500',
        category: 'artesanias',
        featured: true,
        dimensions: '20x15 cm c/u',
        year: 2024,
        technique: 'Crochet',
        materials: ['Hilo de algodón multicolor', 'Relleno', 'Alambre para estructura'],
        inspiration: 'Los colibríes simbolizan la libertad y la alegría. Quise crear una versión tierna que capture su esencia mágica.',
        creationTime: '1 semana',
        rating: 4.9,
        reviewCount: 19,
        status: 'disponible',
    },
    {
        id: '4',
        title: 'Max - Pastor Alemán',
        description: 'Retrato majestuoso de Max, capturando la nobleza y lealtad característica de los pastores alemanes.',
        price: 42000,
        image: '/api/placeholder/400/500',
        category: 'retratos',
        featured: false,
        dimensions: '35x45 cm',
        year: 2024,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo'],
        inspiration: 'Max es un perro con una presencia imponente pero un corazón gentil.',
        creationTime: '2 semanas',
        rating: 4.7,
        reviewCount: 12,
        status: 'disponible',
    },
    {
        id: '5',
        title: 'Paisaje Volcánico',
        description: 'Vista panorámica del Volcán Arenal al amanecer, con sus colores cálidos y majestuosa presencia.',
        price: 55000,
        image: '/api/placeholder/400/500',
        category: 'paisajes',
        featured: false,
        dimensions: '60x80 cm',
        year: 2023,
        technique: 'Acrílico sobre lienzo',
        materials: ['Acrílico', 'Lienzo grande'],
        inspiration: 'El Arenal representa la fuerza y belleza natural de Costa Rica.',
        creationTime: '4 semanas',
        rating: 4.8,
        reviewCount: 8,
        status: 'disponible',
    },
    {
        id: '6',
        title: 'Luna - Gata Persa',
        description: 'Retrato delicado de Luna, una gata persa con ojos azules hipnotizantes.',
        price: 40000,
        image: '/api/placeholder/400/500',
        category: 'retratos',
        featured: false,
        dimensions: '30x40 cm',
        year: 2024,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo'],
        inspiration: 'Los ojos de Luna tienen una profundidad que parece contener secretos del universo.',
        creationTime: '10 días',
        rating: 4.6,
        reviewCount: 15,
        status: 'disponible',
    },
    {
        id: '7',
        title: 'Mariposas Tropicales',
        description: 'Colección de mariposas nativas de Costa Rica en un vibrante jardín tropical.',
        price: 35000,
        image: '/api/placeholder/400/500',
        category: 'naturaleza',
        featured: false,
        dimensions: '50x40 cm',
        year: 2024,
        technique: 'Acuarela',
        materials: ['Acuarela', 'Papel especial'],
        inspiration: 'La diversidad de mariposas en Costa Rica es asombrosa, cada una una joya voladora.',
        creationTime: '2 semanas',
        rating: 4.5,
        reviewCount: 11,
        status: 'disponible',
    },
    {
        id: '8',
        title: 'Cactus en Maceta',
        description: 'Bodegón minimalista con cactus y suculentas en macetas de cerámica artesanal.',
        price: 28000,
        image: '/api/placeholder/400/500',
        category: 'naturaleza',
        featured: false,
        dimensions: '25x35 cm',
        year: 2024,
        technique: 'Acrílico',
        materials: ['Acrílico', 'Lienzo pequeño'],
        inspiration: 'La belleza está en la simplicidad y resistencia de estas plantas.',
        creationTime: '1 semana',
        rating: 4.4,
        reviewCount: 9,
        status: 'disponible',
    },
    {
        id: '9',
        title: 'Tucán Amigurumi',
        description: 'Tucán tejido a mano con colores vibrantes, representando el ave nacional de Costa Rica.',
        price: 25000,
        image: '/api/placeholder/400/500',
        category: 'artesanias',
        featured: false,
        dimensions: '25x20 cm',
        year: 2024,
        technique: 'Crochet',
        materials: ['Hilo multicolor', 'Relleno'],
        inspiration: 'El tucán es símbolo de la riqueza natural costarricense.',
        creationTime: '5 días',
        rating: 4.7,
        reviewCount: 13,
        status: 'disponible',
    },
    {
        id: '10',
        title: 'Atardecer en Manuel Antonio',
        description: 'Paisaje costero capturando la magia del atardecer en una de las playas más hermosas de Costa Rica.',
        price: 48000,
        image: '/api/placeholder/400/500',
        category: 'paisajes',
        featured: false,
        dimensions: '50x70 cm',
        year: 2023,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo'],
        inspiration: 'Los atardeceres en Manuel Antonio son únicos, llenos de colores cálidos.',
        creationTime: '3 semanas',
        rating: 4.9,
        reviewCount: 7,
        status: 'disponible',
    },
    // Agregar más obras para completar el ejemplo
    {
        id: '11',
        title: 'Rocky - Bulldog Francés',
        description: 'Retrato juguetón de Rocky, capturando su personalidad traviesa y encantadora.',
        price: 43000,
        image: '/api/placeholder/400/500',
        category: 'retratos',
        featured: false,
        dimensions: '35x45 cm',
        year: 2024,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo'],
        inspiration: 'Rocky tiene una expresión que siempre me hace sonreír.',
        creationTime: '2 semanas',
        rating: 4.6,
        reviewCount: 10,
        status: 'disponible',
    },
    {
        id: '12',
        title: 'Jardín de Rosas',
        description: 'Hermoso jardín de rosas en plena floración, con una paleta de colores suaves y románticos.',
        price: 36000,
        image: '/api/placeholder/400/500',
        category: 'naturaleza',
        featured: false,
        dimensions: '40x50 cm',
        year: 2024,
        technique: 'Acuarela',
        materials: ['Acuarela', 'Papel'],
        inspiration: 'Las rosas representan el amor y la belleza en su forma más pura.',
        creationTime: '2 semanas',
        rating: 4.5,
        reviewCount: 14,
        status: 'disponible',
    },
    {
        id: '13',
        title: 'Perezoso Amigurumi',
        description: 'Adorable perezoso tejido a mano, representando la tranquilidad de la vida costarricense.',
        price: 20000,
        image: '/api/placeholder/400/500',
        category: 'artesanias',
        featured: false,
        dimensions: '18x15 cm',
        year: 2024,
        technique: 'Crochet',
        materials: ['Hilo café', 'Relleno'],
        inspiration: 'Los perezosos nos enseñan la importancia de tomarse las cosas con calma.',
        creationTime: '4 días',
        rating: 4.8,
        reviewCount: 16,
        status: 'disponible',
    },
    {
        id: '14',
        title: 'Montañas de Cartago',
        description: 'Vista panorámica de las montañas de Cartago envueltas en niebla matutina.',
        price: 52000,
        image: '/api/placeholder/400/500',
        category: 'paisajes',
        featured: false,
        dimensions: '55x75 cm',
        year: 2023,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo grande'],
        inspiration: 'La niebla matutina crea un ambiente místico en las montañas.',
        creationTime: '4 semanas',
        rating: 4.7,
        reviewCount: 6,
        status: 'disponible',
    },
    {
        id: '15',
        title: 'Simba - Gato Naranja',
        description: 'Retrato cálido de Simba, un gato naranja con una personalidad solar.',
        price: 39000,
        image: '/api/placeholder/400/500',
        category: 'retratos',
        featured: false,
        dimensions: '30x40 cm',
        year: 2024,
        technique: 'Óleo sobre lienzo',
        materials: ['Óleo', 'Lienzo'],
        inspiration: 'Simba irradia calidez como un pequeño sol felino.',
        creationTime: '10 días',
        rating: 4.6,
        reviewCount: 12,
        status: 'disponible',
    },
    {
        id: '16',
        title: 'Bromelias del Bosque',
        description: 'Estudio detallado de bromelias en su hábitat natural del bosque nuboso.',
        price: 33000,
        image: '/api/placeholder/400/500',
        category: 'naturaleza',
        featured: false,
        dimensions: '35x45 cm',
        year: 2024,
        technique: 'Acuarela',
        materials: ['Acuarela', 'Papel'],
        inspiration: 'Las bromelias son joyas escondidas en nuestros bosques.',
        creationTime: '2 semanas',
        rating: 4.4,
        reviewCount: 8,
        status: 'disponible',
    },
];

const ITEMS_PER_PAGE = 15;

export function GalleryFull() {
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

    // Filtrar obras por categoría y estado
    const filteredArtworks = allArtworks.filter(artwork => {
        const matchesCategory = selectedCategory === 'todas' || artwork.category === selectedCategory;
        const matchesEstado = selectedEstado === 'todos' || 
            (selectedEstado === 'disponible' && artwork.status === 'disponible') ||
            (selectedEstado === 'vendido' && artwork.status === 'vendida');
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

                {/* Filtros por categoría y estado */}
                <div className="mb-8 space-y-4">
                    {/* Filtros por categoría */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">Categorías</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                                        selectedCategory === category
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                >
                                    {category === 'todas' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Filtros por estado */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">Estado</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['todos', 'disponible', 'vendido'].map((estado) => (
                                <button
                                    key={estado}
                                    onClick={() => handleEstadoChange(estado)}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                                        selectedEstado === estado
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                >
                                    {estado === 'todos' ? 'Todos' : 
                                     estado === 'disponible' ? 'Disponible' : 'Vendido'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

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

                {/* Grid de obras */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {currentArtworks.map((artwork) => (
                        <Card key={artwork.id} className="group">
                            <div className="relative overflow-hidden">
                                <Image
                                    src={artwork.image}
                                    alt={artwork.title}
                                    width={400}
                                    height={500}
                                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                />

                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleViewArtwork(artwork)}
                                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(artwork.id);
                                            }}
                                            className={cn(
                                                'p-3 backdrop-blur-sm rounded-full transition-colors',
                                                favorites.has(artwork.id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white/20 text-white hover:bg-white/30'
                                            )}
                                        >
                                            <Heart className={cn('h-5 w-5', favorites.has(artwork.id) && 'fill-current')} />
                                        </button>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {artwork.featured && (
                                        <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Destacada
                                        </div>
                                    )}
                                    {artwork.status === 'vendida' && (
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Vendida
                                        </div>
                                    )}
                                    {artwork.status === 'disponible' && (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Disponible
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
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
                                        artwork.status === 'vendida' && "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                                    )}
                                    onClick={() => handleViewArtwork(artwork)}
                                    disabled={artwork.status === 'vendida'}
                                >
                                    {artwork.status === 'vendida' ? '🔒 Obra Vendida' : '👁️ Ver Detalles'}
                                </Button>
                            </div>
                        </Card>
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