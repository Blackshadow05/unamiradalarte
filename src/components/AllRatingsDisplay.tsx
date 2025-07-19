import { useState, useEffect } from 'react'
import { ratingsService, type ArtworkRating } from '../lib/supabase'

interface ExtendedRating extends ArtworkRating {
  artwork_title?: string
}

export default function AllRatingsDisplay() {
  const [ratings, setRatings] = useState<ExtendedRating[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'verified' | '5-stars'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low'>('newest')

  // Mapeo de IDs de obras a títulos
  const artworkTitles: { [key: string]: string } = {
    '1': 'Susurros del Alma',
    '2': 'Danza de Colores',
    '3': 'Reflexiones Urbanas',
    '4': 'Serenidad Azul',
    '5': 'Fuego Interior',
    '6': 'Naturaleza Abstracta',
    '7': 'Osito Dulce',
    '8': 'Conejito Primaveral',
    '9': 'Gatito Mimoso'
  }

  useEffect(() => {
    loadAllRatings()
  }, [])

  const loadAllRatings = async () => {
    try {
      const allRatings = await ratingsService.getAllRatings()
      
      // Añadir títulos de obras
      const ratingsWithTitles = allRatings.map(rating => ({
        ...rating,
        artwork_title: artworkTitles[rating.artwork_id] || `Obra ${rating.artwork_id}`
      }))
      
      setRatings(ratingsWithTitles)
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedRatings = () => {
    let filtered = [...ratings]

    // Aplicar filtros
    switch (filter) {
      case 'verified':
        filtered = filtered.filter(rating => rating.verified)
        break
      case '5-stars':
        filtered = filtered.filter(rating => rating.rating === 5)
        break
      default:
        break
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime())
        break
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'rating-low':
        filtered.sort((a, b) => a.rating - b.rating)
        break
    }

    return filtered
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-yellow-400 ${i < rating ? 'opacity-100' : 'opacity-30'}`}>
        ★
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString))
  }

  const getStats = () => {
    const total = ratings.length
    const verified = ratings.filter(r => r.verified).length
    const fiveStars = ratings.filter(r => r.rating === 5).length
    const average = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0

    return { total, verified, fiveStars, average }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 art-shadow animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Ratings Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 art-shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const stats = getStats()
  const displayedRatings = filteredAndSortedRatings()

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 art-shadow text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Calificaciones</div>
        </div>
        <div className="bg-white rounded-2xl p-6 art-shadow text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{stats.average.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Promedio General</div>
        </div>
        <div className="bg-white rounded-2xl p-6 art-shadow text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{stats.fiveStars}</div>
          <div className="text-sm text-gray-600">Calificaciones 5★</div>
        </div>
        <div className="bg-white rounded-2xl p-6 art-shadow text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{stats.verified}</div>
          <div className="text-sm text-gray-600">Reseñas Verificadas</div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-2xl p-6 art-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filtrar:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({ratings.length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'verified' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verificadas ({stats.verified})
            </button>
            <button
              onClick={() => setFilter('5-stars')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === '5-stars' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              5 Estrellas ({stats.fiveStars})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Más Recientes</option>
              <option value="oldest">Más Antiguas</option>
              <option value="rating-high">Mayor Calificación</option>
              <option value="rating-low">Menor Calificación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRatings.map((rating, index) => (
          <div
            key={rating.id}
            className="bg-white rounded-2xl p-6 art-shadow hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fade-in-scale 0.6s ease-out both'
            }}
          >
            {/* Header con estrellas */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm">
                {renderStars(rating.rating)}
              </div>
              {rating.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  ✓ Verificado
                </span>
              )}
            </div>

            {/* Comentario */}
            {rating.comment && (
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "{rating.comment}"
              </blockquote>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                <p className="font-medium text-gray-900">{rating.user_name}</p>
                <p className="text-primary-600 font-medium">{rating.artwork_title}</p>
              </div>
              <p>{formatDate(rating.created_at!)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedRatings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay calificaciones</h3>
          <p className="text-gray-500">No se encontraron calificaciones con los filtros seleccionados.</p>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center pt-8">
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-2xl hover:bg-primary-600 hover:text-white transition-all duration-300"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Inicio
        </a>
      </div>
    </div>
  )
}