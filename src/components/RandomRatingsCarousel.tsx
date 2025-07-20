import { useState, useEffect } from 'react'
import { ratingsService, type ArtworkRating } from '../lib/supabase'

interface ExtendedRating extends ArtworkRating {
  artwork_title?: string
}

export default function RandomRatingsCarousel() {
  const [ratings, setRatings] = useState<ExtendedRating[]>([])
  const [displayedRatings, setDisplayedRatings] = useState<ExtendedRating[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [fadingOutIndex, setFadingOutIndex] = useState<number | null>(null)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [animationKey, setAnimationKey] = useState(0)

  // Mapeo de IDs de obras a títulos (basado en tu galería)
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
    loadRatings()
  }, [])

  useEffect(() => {
    if (ratings.length > 0) {
      // Seleccionar 6 calificaciones aleatorias iniciales
      selectRandomRatings()
      
      // Configurar rotación automática cada 8 segundos
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % 6)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [ratings])

  useEffect(() => {
    if (ratings.length > 6) {
      // Iniciar transición elegante
      setIsTransitioning(true)
      
      // Seleccionar qué calificación va a desaparecer
      const randomIndex = Math.floor(Math.random() * displayedRatings.length)
      setFadingOutIndex(randomIndex)
      
      // Después de 3 segundos (completamente desvanecido), reemplazar la calificación
      const timer = setTimeout(() => {
        replaceRandomRating(randomIndex)
        setFadingOutIndex(null)
        setAnimatingIndex(randomIndex) // Marcar cuál va a animar
        setAnimationKey(prev => prev + 1) // Forzar nueva animación
        
        // Terminar transición después de la aparición
        setTimeout(() => {
          setIsTransitioning(false)
          setAnimatingIndex(null)
        }, 2000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, ratings.length, displayedRatings.length])

  const loadRatings = async () => {
    try {
      const allRatings = await ratingsService.getAllRatings()
      
      // Añadir títulos de obras y filtrar solo calificaciones con comentarios
      const ratingsWithTitles = allRatings
        .filter(rating => rating.comment && rating.comment.trim().length > 0)
        .map(rating => ({
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

  const selectRandomRatings = () => {
    if (ratings.length === 0) return
    
    const shuffled = [...ratings].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(6, ratings.length))
    setDisplayedRatings(selected)
  }

  const replaceRandomRating = (targetIndex: number) => {
    if (ratings.length <= 6) return

    const availableRatings = ratings.filter(
      rating => !displayedRatings.some(displayed => displayed.id === rating.id)
    )
    
    if (availableRatings.length === 0) return

    const randomIndex = Math.floor(Math.random() * availableRatings.length)
    const randomNewRating = availableRatings[randomIndex]!
    
    setDisplayedRatings(prev => {
      const newRatings = [...prev]
      newRatings[targetIndex] = randomNewRating
      return newRatings
    })
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    )
  }

  if (displayedRatings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay calificaciones disponibles</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedRatings.map((rating, index) => {
        const isHighlighted = index === currentIndex % displayedRatings.length
        const isFadingOut = fadingOutIndex === index
        const isAnimating = animatingIndex === index
        
        return (
          <div
            key={isAnimating ? `${rating.id}-${animationKey}-${index}` : `${rating.id}-${index}`}
            className={`bg-white rounded-2xl p-6 art-shadow transition-all duration-[3000ms] ease-in-out transform hover:scale-[1.01] hover:shadow-lg ${
              isHighlighted ? 'ring-1 ring-primary-100 shadow-lg bg-gradient-to-br from-white via-white to-primary-25' : ''
            } ${
              isFadingOut ? 'opacity-0 scale-[0.95]' : 'opacity-100 scale-100'
            } ${
              isAnimating ? 'animate-slide-in-from-top-cascade' : ''
            }`}
            style={{
              transitionProperty: 'opacity, transform, box-shadow',
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              transitionDuration: '3000ms'
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
          <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic line-clamp-3">
            "{rating.comment}"
          </blockquote>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              <p className="font-medium text-gray-900">{rating.user_name}</p>
              <p className="text-primary-600 font-medium">{rating.artwork_title}</p>
            </div>
            <p>{formatDate(rating.created_at!)}</p>
          </div>
        </div>
        )
      })}
      </div>
      
      {/* Botón Ver Más Calificaciones */}
      <div className="text-center mt-12">
        <a
          href="/calificaciones"
          className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl art-shadow"
        >
          <span>Ver Más Calificaciones</span>
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}