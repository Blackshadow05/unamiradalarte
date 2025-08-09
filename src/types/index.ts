export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: 'destacadas' | 'retratos-mascotas' | 'bodegones' | 'amigurumi' | 'retratos' | 'naturaleza' | 'artesanias' | 'paisajes';
  featured: boolean;
  dimensions?: string;
  year: number;
  technique: string;
  materials: string[];
  inspiration: string;
  creationTime: string;
  rating: number;
  reviewCount: number;
  status: 'disponible' | 'vendida' | 'reservada';
}

export interface Review {
  id: string;
  artworkId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ReviewForm {
  rating: number;
  comment: string;
  userName: string;
}

export interface Artist {
  name: string;
  bio: string;
  image: string;
  specialties: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: 'consulta' | 'encargo' | 'colaboracion' | 'otro';
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Tipo para la tabla Galeria de Supabase
export interface GaleriaItem {
  id: number;
  created_at: string;
  Nombre_obra: string | null;
  Descripcion: string | null;
  Categoria: string | null;
  image: string | null;
  Año: number | null;
  Dimensiones: string | null;
  Tecnica: string | null;
  Tiempo_creacion: string | null;
  Materiales: string | null;
  Inspiracion: string | null;
  image_thumbnail: string | null;
  image_gallery: string | null;
  image_detail: string | null;
  image_original: string | null;
  Estado: string | null;
  Precio: string | null;
}

// Tipo para la tabla artwork_ratings de Supabase
export interface ArtworkRating {
  id: number;
  artwork_id: string;
  user_name: string | null;
  user_email: string | null;
  rating: number;
  comment: string | null;
  verified: boolean | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Tipo para la tabla artwork_ratings de Supabase
export interface ArtworkRating {
  id: number;
  artwork_id: string;
  user_name: string | null;
  user_email: string | null;
  rating: number;
  comment: string | null;
  verified: boolean | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string | null;
  updated_at: string | null;
}