import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cturqalloieehxxrqzsw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXJxYWxsb2llZWh4eHJxenN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTU5OTMsImV4cCI6MjA2ODUzMTk5M30.7v-_m56nZyV7ZT3JhVAR6Hbtc4ZN9sTnrVyZVPYPeXA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface ArtworkRating {
  id?: number
  artwork_id: string
  user_name?: string
  user_email?: string
  rating: number
  comment?: string
  verified?: boolean
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}

// Funciones para interactuar con las calificaciones
export const ratingsService = {
  // Obtener todas las calificaciones de una obra
  async getRatingsByArtwork(artworkId: string) {
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('*')
      .eq('artwork_id', artworkId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Obtener estadísticas de calificaciones de una obra
  async getArtworkRatingStats(artworkId: string) {
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('rating')
      .eq('artwork_id', artworkId)
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return { averageRating: 0, totalRatings: 0 }
    }

    const totalRatings = data.length
    const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / totalRatings
    
    return { averageRating: Math.round(averageRating * 10) / 10, totalRatings }
  },

  // Insertar nueva calificación
  async addRating(rating: Omit<ArtworkRating, 'id' | 'updated_at'>) {
    // Si no se proporciona created_at, usar fecha local
    if (!rating.created_at) {
      const now = new Date()
      const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 19) // Remover la 'Z' y milisegundos
      rating.created_at = localDateTime
    }

    const { data, error } = await supabase
      .from('artwork_ratings')
      .insert([rating])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Obtener todas las calificaciones (para admin)
  async getAllRatings() {
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}