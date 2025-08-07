'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { getAllArtworkRatings, insertSampleReviews } from '@/lib/supabase';
import { ArtworkRating } from '@/types';
import { User, Calendar, CheckCircle, Filter, Search, SortAsc, Grid, Table } from 'lucide-react';

interface ReviewWithArtwork extends ArtworkRating {
  artwork_title?: string;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
type FilterOption = 'all' | 'verified' | 'unverified';

export function AllReviews() {
  const [allReviews, setAllReviews] = useState<ReviewWithArtwork[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewWithArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 12;
  const [debugInfo, setDebugInfo] = useState<string>('Iniciando...');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Cargar todas las reseñas
  useEffect(() => {
    async function loadAllReviews() {
      try {
        setLoading(true);
        setDebugInfo('Iniciando carga...');
        console.log('🔄 Iniciando carga de todas las reseñas...');
        
        // Obtener todas las reseñas de la base de datos
        setDebugInfo('Llamando a getAllArtworkRatings...');
        console.log('🔄 Llamando a getAllArtworkRatings...');
        const allReviewsData = await getAllArtworkRatings();
        setDebugInfo(`Obtenidas ${allReviewsData.length} reseñas`);
        console.log('📊 Reseñas obtenidas de la base de datos:', allReviewsData.length);
        console.log('📋 Datos de reseñas:', allReviewsData);
        
        if (allReviewsData.length > 0) {
          // Agregar títulos de obras
          setDebugInfo('Procesando títulos de obras...');
          const reviewsWithTitles = allReviewsData.map(review => ({
            ...review,
            artwork_title: getArtworkTitle(review.artwork_id)
          }));
          
          setDebugInfo(`✅ ${reviewsWithTitles.length} reseñas reales cargadas`);
          console.log('✅ Usando reseñas reales de la base de datos');
          setAllReviews(reviewsWithTitles);
          setFilteredReviews(reviewsWithTitles);
        } else {
          setDebugInfo('⚠️ Sin reseñas, usando mock');
          console.log('⚠️ No hay reseñas, usando datos mock');
          const mockData = getMockReviews();
          setAllReviews(mockData);
          setFilteredReviews(mockData);
        }
      } catch (error) {
        setDebugInfo(`❌ Error: ${error}`);
        console.error('❌ Error al cargar reseñas:', error);
        console.log('🔄 Fallback: usando datos de ejemplo');
        const mockData = getMockReviews();
        setAllReviews(mockData);
        setFilteredReviews(mockData);
      } finally {
        setLoading(false);
      }
    }

    loadAllReviews();
  }, []);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = [...allReviews];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.artwork_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por verificación
    if (filterBy === 'verified') {
      filtered = filtered.filter(review => review.verified);
    } else if (filterBy === 'unverified') {
      filtered = filtered.filter(review => !review.verified);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allReviews, searchTerm, sortBy, filterBy]);

  // Paginación
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  // Función para obtener título de obra
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

  // Reseñas de ejemplo
  const getMockReviews = (): ReviewWithArtwork[] => [
    {
      id: 1,
      artwork_id: '1',
      user_name: 'María González',
      user_email: null,
      rating: 5,
      comment: 'Increíble trabajo! El retrato de mi mascota quedó perfecto, capturó su personalidad completamente. Los detalles son impresionantes y se nota el amor en cada pincelada.',
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
      comment: 'Las orquídeas se ven tan reales que parece que puedo oler su fragancia. Una obra maestra que refleja la belleza de Costa Rica.',
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
      comment: 'Los colibríes amigurumi son adorables! Mi hija los ama y no se separa de ellos. Excelente calidad y muy tiernos.',
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
      comment: 'Hermoso paisaje que refleja la belleza natural de Costa Rica. Los colores son vibrantes y llenos de vida.',
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
      comment: 'Una pieza única que transmite mucha emoción. Se nota el amor y dedicación del artista en cada detalle.',
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
      comment: 'Las mariposas parecen estar a punto de volar. Un trabajo delicado y hermoso que alegra cualquier espacio.',
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
      comment: 'Me encanta el estilo minimalista. Perfecto para decorar mi oficina. La calidad es excelente.',
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
      comment: 'El tucán amigurumi es precioso! Representa muy bien nuestra fauna costarricense. Mi hijo está encantado.',
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const getAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / filteredReviews.length).toFixed(1);
  };

  // Función para extraer información básica del navegador
  const getBrowserInfo = (userAgent: string): string => {
    if (!userAgent) return 'Desconocido';
    
    // Detectar navegador
    let browser = 'Desconocido';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    // Detectar OS básico
    let os = '';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    return os ? `${browser} (${os})` : browser;
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando todas las reseñas...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* Estadísticas */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">{filteredReviews.length}</div>
              <div className="text-gray-600">Reseñas Totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">{getAverageRating()}</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {filteredReviews.filter(r => r.verified).length}
              </div>
              <div className="text-gray-600">Reseñas Verificadas</div>
            </div>
          </div>
          
          {/* Botones de debug temporal */}
          <div className="text-center mt-6 space-x-4">

            
            {filteredReviews.length === 0 && (
              <button
                onClick={async () => {
                  console.log('🔄 Insertando reseñas de ejemplo manualmente...');
                  const success = await insertSampleReviews();
                  if (success) {
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                🧪 Insertar Reseñas de Ejemplo
              </button>
            )}
          </div>
        </div>

        {/* Controles de filtrado y búsqueda */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar en reseñas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filtro */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="all">Todas las reseñas</option>
                <option value="verified">Solo verificadas</option>
                <option value="unverified">No verificadas</option>
              </select>
            </div>

            {/* Ordenar */}
            <div className="relative">
              {sortBy === 'newest' || sortBy === 'oldest' ? (
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              ) : (
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="highest">Mejor calificadas</option>
                <option value="lowest">Menor calificadas</option>
              </select>
            </div>

            {/* Selector de vista */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Table className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Vista de reseñas */}
        {currentReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron reseñas</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {currentReviews.map((review) => (
              <Card key={review.id} className="hover-lift">
  <div className="p-6 flex flex-col gap-2">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
        <User className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="font-semibold text-gray-900">
          {review.user_name || 'Usuario Anónimo'}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(review.created_at)}
        </div>
      </div>
    </div>
    <div className="font-medium text-primary-600 mb-1 text-sm">{review.artwork_title}</div>
    <div className="mb-1">
      <StarRating rating={review.rating} readonly size="sm" />
    </div>
    <blockquote className="text-gray-700 italic text-base">
      "{review.comment || 'Sin comentario'}"
    </blockquote>
  </div>
</Card>
            ))}
          </div>
        ) : (
          /* Vista de tabla */
          <div className="mb-12 overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Navegador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{review.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {review.user_name || 'Anónimo'}
                        {review.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.user_email ? (
                        <span className="truncate max-w-[150px] block">{review.user_email}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium text-primary-600">{review.artwork_title}</div>
                        <div className="text-gray-500 font-mono text-xs">ID: {review.artwork_id}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <StarRating rating={review.rating} readonly size="sm" />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={review.comment || ''}>
                        {review.comment || 'Sin comentario'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {review.verified ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {review.ip_address ? (
                        review.ip_address.split('.').map((part, index) => 
                          index < 2 ? part : 'xxx'
                        ).join('.')
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.user_agent ? (
                        <span className="truncate max-w-[120px] block" title={getBrowserInfo(review.user_agent)}>
                          {getBrowserInfo(review.user_agent)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.updated_at && review.updated_at !== review.created_at ? (
                        formatDate(review.updated_at)
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
}