export interface Artwork {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'pintura' | 'acuarela' | 'oleo' | 'mixta' | 'amigurumi' | 'personalizados';
  year: number;
  dimensions: string;
  price?: number;
  available: boolean;
  featured: boolean;
  technique?: string;
  inspiration?: string;
  materials?: string[];
  rating?: number;
  totalRatings?: number;
}

export interface Review {
  id: string;
  artworkId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface Artist {
  name: string;
  bio: string;
  image: string;
  email: string;
  social: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  artworks: string[];
  featured: boolean;
}