import { useState, useEffect } from 'react'
import { ratingsService, type ArtworkRating } from '../lib/supabase'
import Toast from './Toast'

interface ArtworkRatingsProps {
  artworkId: string
  artworkTitle: string
}

export default function ArtworkRatings({ artworkId, artworkTitle }: ArtworkRatingsProps) {
  const [ratings, setRatings] = useState<ArtworkRating[]>([])
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Estado para el toast
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  })
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    loadRatings()
  }, [artworkId])

  const loadRatings = async () => {
    try {
      setLoading(true)
      const [ratingsData, statsData] = await Promise.all([
        ratingsService.getRatingsByArtwork(artworkId),
        ratingsService.getArtworkRatingStats(artworkId)
      ])
      
      setRatings(ratingsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Obtener fecha local sin zona horaria
      const now = new Date()
      const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 19) // Remover la 'Z' y milisegundos
      
      await ratingsService.addRating({
        artwork_id: artworkId,
        user_name: formData.user_name,
        user_email: formData.user_email,
        rating: formData.rating,
        comment: formData.comment,
        verified: false, // Las nuevas calificaciones no están verificadas por defecto
        created_at: localDateTime
      })

      // Recargar calificaciones
      await loadRatings()
      
      // Resetear formulario
      setFormData({ user_name: '', user_email: '', rating: 5, comment: '' })
      setShowForm(false)
      
      // Mostrar toast de éxito
      setToast({
        isVisible: true,
        message: '¡Gracias por tu calificación! Tu opinión es muy valiosa para nosotros.',
        type: 'success'
      })
    } catch (error) {
      console.error('Error submitting rating:', error)
      
      // Mostrar toast de error
      setToast({
        isVisible: true,
        message: 'Error al enviar la calificación. Por favor intenta de nuevo.',
        type: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        className={`text-2xl ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(i + 1) : undefined}
        disabled={!interactive}
      >
        ★
      </button>
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
      <div className="bg-white rounded-2xl p-6 art-shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 art-shadow">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Calificaciones</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(Math.round(stats.averageRating))}
              <span className="ml-2 text-lg font-semibold text-gray-700">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">
              ({stats.totalRatings} {stats.totalRatings === 1 ? 'calificación' : 'calificaciones'})
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Calificar'}
        </button>
      </div>

      {/* Formulario de nueva calificación */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-4">Califica "{artworkTitle}"</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Tu email"
              value={formData.user_email}
              onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación
            </label>
            <div className="flex items-center">
              {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
            </div>
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Comparte tu opinión sobre esta obra..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Enviar Calificación'}
          </button>
        </form>
      )}

      {/* Toast de notificación */}
      {toast.isVisible && (
        <div className="mb-6">
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => setToast({ ...toast, isVisible: false })}
          />
        </div>
      )}

      {/* Lista de calificaciones */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Sé el primero en calificar esta obra
          </p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-semibold text-gray-900">{rating.user_name}</h5>
                    {rating.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {renderStars(rating.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(rating.created_at!)}
                </span>
              </div>
              
              {rating.comment && (
                <p className="text-gray-700 italic">"{rating.comment}"</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}