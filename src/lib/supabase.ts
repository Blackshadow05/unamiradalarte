import { createClient } from '@supabase/supabase-js';
import { GaleriaItem, ArtworkRating, Review } from '@/types';

// Verificamos que las variables de entorno estén definidas
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL debe estar definido en .env.local');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY debe estar definido en .env.local');
}

// Creamos el cliente de Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Función para verificar la conexión
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) {
      console.error('Error al conectar con Supabase:', error);
      return false;
    }
    
    console.log('Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al verificar la conexión con Supabase:', error);
    return false;
  }
}

// Función para obtener obras destacadas
export async function getObrasDestacadas(): Promise<GaleriaItem[]> {
  try {
    const { data, error } = await supabase
      .from('Galeria')
      .select('*')
      .eq('Categoria', 'Obras Destacadas')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener obras destacadas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error al obtener obras destacadas:', error);
    return [];
  }
}

// Función para obtener reseñas de una obra específica
export async function getArtworkRatings(artworkId: string): Promise<ArtworkRating[]> {
  try {
    console.log(`🔍 Obteniendo reseñas para obra: ${artworkId}`);
    
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('*')
      .eq('artwork_id', artworkId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error detallado al obtener reseñas:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        artworkId
      });
      return [];
    }

    console.log(`✅ ${data?.length || 0} reseñas obtenidas para obra ${artworkId}`);
    return data || [];
  } catch (error) {
    console.error('❌ Error de excepción al obtener reseñas:', error);
    return [];
  }
}

// Función para agregar una nueva reseña
export async function addArtworkRating(rating: {
  artwork_id: string;
  user_name: string;
  user_email?: string;
  rating: number;
  comment: string;
}): Promise<ArtworkRating | null> {
  try {
    console.log('🔄 Intentando guardar reseña:', rating);
    
    // Obtener información del cliente
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null;
    
    // Obtener la fecha y hora actual del dispositivo sin zona horaria
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 19); // Formato: YYYY-MM-DDTHH:mm:ss (sin la Z y milisegundos)
    
    console.log('📅 Fecha y hora local del dispositivo:', localDateTime);
    
    const { data, error } = await supabase
      .from('artwork_ratings')
      .insert([
        {
          artwork_id: rating.artwork_id,
          user_name: rating.user_name,
          user_email: rating.user_email || null,
          rating: rating.rating,
          comment: rating.comment,
          verified: false,
          user_agent: userAgent,
          created_at: localDateTime,
          updated_at: localDateTime,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error detallado al agregar reseña:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log('✅ Reseña guardada exitosamente:', data);
    return data;
  } catch (error) {
    console.error('❌ Error de excepción al agregar reseña:', error);
    return null;
  }
}

// Función para obtener estadísticas de reseñas de una obra
export async function getArtworkRatingStats(artworkId: string): Promise<{
  averageRating: number;
  totalReviews: number;
}> {
  try {
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('rating')
      .eq('artwork_id', artworkId);

    if (error) {
      console.error('Error al obtener estadísticas de reseñas:', error);
      return { averageRating: 0, totalReviews: 0 };
    }

    if (!data || data.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalReviews = data.length;
    const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / totalReviews;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
      totalReviews
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de reseñas:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
}

// Función para verificar si la tabla artwork_ratings existe
export async function checkArtworkRatingsTable(): Promise<boolean> {
  try {
    console.log('🔍 Verificando acceso a tabla artwork_ratings...');
    
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Error al acceder a artwork_ratings:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('✅ Tabla artwork_ratings existe y es accesible. Registros encontrados:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Error de excepción al verificar tabla artwork_ratings:', error);
    return false;
  }
}

// Función para probar inserción simple
export async function testArtworkRatingInsert(): Promise<boolean> {
  try {
    console.log('🧪 Probando inserción en artwork_ratings...');
    
    // Obtener la fecha y hora actual del dispositivo sin zona horaria
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 19);
    
    const testData = {
      artwork_id: 'test-123',
      user_name: 'Usuario de Prueba',
      rating: 5,
      comment: 'Comentario de prueba',
      verified: false,
      created_at: localDateTime,
      updated_at: localDateTime,
    };

    const { data, error } = await supabase
      .from('artwork_ratings')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error en inserción de prueba:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('✅ Inserción de prueba exitosa:', data);
    
    // Limpiar el registro de prueba
    await supabase
      .from('artwork_ratings')
      .delete()
      .eq('id', data.id);
    
    return true;
  } catch (error) {
    console.error('❌ Error de excepción en inserción de prueba:', error);
    return false;
  }
}

// Función para obtener todas las reseñas de la base de datos
export async function getAllArtworkRatings(): Promise<ArtworkRating[]> {
  try {
    console.log('🔍 Obteniendo todas las reseñas...');
    
    const { data, error } = await supabase
      .from('artwork_ratings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener todas las reseñas:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return [];
    }

    console.log(`✅ ${data?.length || 0} reseñas obtenidas exitosamente`);
    return data || [];
  } catch (error) {
    console.error('❌ Error de excepción al obtener todas las reseñas:', error);
    return [];
  }
}

// Función para insertar reseñas de ejemplo (solo para testing)
export async function insertSampleReviews(): Promise<boolean> {
  try {
    console.log('🧪 Insertando reseñas de ejemplo...');
    
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 19);

    const sampleReviews = [
      {
        artwork_id: '1',
        user_name: 'María González',
        rating: 5,
        comment: 'Increíble trabajo! El retrato de mi mascota quedó perfecto, capturó su personalidad completamente.',
        verified: true,
        created_at: localDateTime,
        updated_at: localDateTime,
      },
      {
        artwork_id: '2',
        user_name: 'Carlos Rodríguez',
        rating: 5,
        comment: 'Las orquídeas se ven tan reales que parece que puedo oler su fragancia. Una obra maestra.',
        verified: false,
        created_at: localDateTime,
        updated_at: localDateTime,
      },
      {
        artwork_id: '3',
        user_name: 'Ana Jiménez',
        rating: 5,
        comment: 'Los colibríes amigurumi son adorables! Mi hija los ama y no se separa de ellos.',
        verified: true,
        created_at: localDateTime,
        updated_at: localDateTime,
      }
    ];

    const { data, error } = await supabase
      .from('artwork_ratings')
      .insert(sampleReviews)
      .select();

    if (error) {
      console.error('❌ Error al insertar reseñas de ejemplo:', error);
      return false;
    }

    console.log('✅ Reseñas de ejemplo insertadas:', data?.length);
    return true;
  } catch (error) {
    console.error('❌ Error de excepción al insertar reseñas de ejemplo:', error);
    return false;
  }
}

// Función helper para convertir ArtworkRating a Review
export function convertArtworkRatingToReview(artworkRating: ArtworkRating): Review {
  return {
    id: artworkRating.id.toString(),
    artworkId: artworkRating.artwork_id,
    userName: artworkRating.user_name || 'Usuario Anónimo',
    rating: artworkRating.rating,
    comment: artworkRating.comment || '',
    date: artworkRating.created_at 
      ? new Date(artworkRating.created_at).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : 'Fecha no disponible',
    verified: artworkRating.verified || false,
  };
}