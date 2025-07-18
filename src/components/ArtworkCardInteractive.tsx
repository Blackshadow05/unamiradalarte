import { useState } from 'react';
import type { Artwork } from '../types';
import ArtworkModal from './ArtworkModal';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCardInteractive({ artwork }: ArtworkCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCategoryLabel = (category: string) => {
    const labels = {
      'pintura': 'Pintura',
      'acuarela': 'Acuarela',
      'oleo': 'Óleo',
      'mixta': 'Técnica Mixta',
      'amigurumi': 'Amigurumi'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <article 
        className="group relative bg-white rounded-2xl overflow-hidden art-shadow hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={artwork.image} 
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {getCategoryLabel(artwork.category)}
                </span>
                <span className="text-sm">{artwork.year}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          {!artwork.available && (
            <div className="absolute top-4 right-4">
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Vendida
              </span>
            </div>
          )}

          {/* Rating Badge */}
          {artwork.rating && (
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {artwork.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {artwork.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {artwork.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{artwork.dimensions}</span>
            {artwork.price && (
              <span className="font-semibold text-primary-600">
                ${artwork.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <button className="bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-primary-600 hover:text-white transition-colors duration-300">
            Ver Detalles
          </button>
        </div>
      </article>

      {/* Modal */}
      <ArtworkModal 
        artwork={artwork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}