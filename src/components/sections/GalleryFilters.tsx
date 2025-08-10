'use client';
import React from 'react';

type GalleryFiltersProps = {
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  currentEstado: string;
  onEstadoChange: (estado: string) => void;
};

export function GalleryFilters({
  categories,
  currentCategory,
  onCategoryChange,
  currentEstado,
  onEstadoChange
}: GalleryFiltersProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-2 rounded-md border ${currentCategory === cat ? 'bg-primary-100 text-primary-700 font-semibold' : 'bg-white text-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div>
        <select
          value={currentEstado}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="px-3 py-2 border rounded-md"
          aria-label="Filtrar por estado"
        >
          <option value="todos">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="vendido">Vendida</option>
        </select>
      </div>
    </div>
  );
}