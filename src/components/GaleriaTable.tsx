'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Tipos para la tabla Galeria
interface GaleriaItem {
  id: number;
  created_at: string;
  Nombre_obra: string;
  Descripcion: string;
  Categoria: string;
  image: string;
}

// Crear cliente de Supabase
const supabaseUrl = 'https://cturqalloieehxxrqzsw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXJxYWxsb2llZWh4eHJxenN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTU5OTMsImV4cCI6MjA2ODUzMTk5M30.7v-_m56nZyV7ZT3JhVAR6Hbtc4ZN9sTnrVyZVPYPeXA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GaleriaTable() {
  const [obras, setObras] = useState<GaleriaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Cargar obras desde Supabase
  useEffect(() => {
    const fetchObras = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('Galeria')
          .select('*')
          .order('created_at', { ascending: false });

        if (filtroCategoria) {
          query = query.eq('Categoria', filtroCategoria);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(`Error al cargar las obras: ${error.message}`);
        }

        setObras(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchObras();
  }, [filtroCategoria]);

  // Filtrar obras por búsqueda
  const obrasFiltradas = obras.filter(obra => 
    obra.Nombre_obra.toLowerCase().includes(busqueda.toLowerCase()) ||
    obra.Descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(obrasFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const obrasPaginadas = obrasFiltradas.slice(startIndex, startIndex + itemsPerPage);

  // Eliminar obra
  const handleEliminar = async (id: number, imagePath: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
      return;
    }

    try {
      setIsLoading(true);

      // 1. Eliminar el registro de la base de datos
      const { error: deleteError } = await supabase
        .from('Galeria')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(`Error al eliminar la obra: ${deleteError.message}`);
      }

      // 2. Extraer el nombre del archivo de la URL
      const imageFileName = imagePath.split('/').pop();
      
      if (imageFileName) {
        // 3. Eliminar la imagen del storage
        const { error: storageError } = await supabase.storage
          .from('galeria')
          .remove([imageFileName]);

        if (storageError) {
          console.warn(`No se pudo eliminar la imagen: ${storageError.message}`);
        }
      }

      // 4. Actualizar la lista de obras
      setObras(obras.filter(obra => obra.id !== id));
      
      alert('Obra eliminada correctamente');
    } catch (err) {
      console.error('Error:', err);
      alert(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Obtener ícono según categoría
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Obras en Venta':
        return '🛒';
      case 'Amigurumi':
        return '🧶';
      case 'Trabajos Personalizados':
        return '✨';
      case 'Retratos de mascotas':
        return '🐾';
      default:
        return '🎨';
    }
  };

  // Obtener color según categoría
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'Obras en Venta':
        return 'from-blue-100 to-blue-200 text-blue-800';
      case 'Amigurumi':
        return 'from-pink-100 to-pink-200 text-pink-800';
      case 'Trabajos Personalizados':
        return 'from-purple-100 to-purple-200 text-purple-800';
      case 'Retratos de mascotas':
        return 'from-amber-100 to-amber-200 text-amber-800';
      default:
        return 'from-emerald-100 to-emerald-200 text-emerald-800';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/30 shadow-2xl shadow-gray-500/10 overflow-hidden animate-fade-in">
      <div className="px-8 py-6 border-b border-gray-200/30 bg-gradient-to-r from-gray-50/50 to-purple-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">Lista de Obras</h3>
            <p className="text-sm text-gray-600 mt-1">Gestiona todas tus obras de arte</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {obras.length} obras
            </span>
          </div>
        </div>
      </div>
      
      {/* Búsqueda y Filtros */}
      <div className="px-8 py-4 bg-gradient-to-r from-gray-50/30 to-purple-50/30 border-b border-gray-200/30">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="🔍 Buscar obras..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-6 py-3 border-2 border-purple-200/50 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg shadow-purple-500/10"
            />
            <svg className="w-5 h-5 text-purple-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <select 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-6 py-3 border-2 border-purple-200/50 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg shadow-purple-500/10 font-medium"
          >
            <option value="">🎨 Todas las categorías</option>
            <option value="Todas las Obras">🎨 Todas las Obras</option>
            <option value="Obras en Venta">🛒 Obras en Venta</option>
            <option value="Amigurumi">🧶 Amigurumi</option>
            <option value="Trabajos Personalizados">✨ Trabajos Personalizados</option>
            <option value="Retratos de mascotas">🐾 Retratos de mascotas</option>
          </select>
        </div>
      </div>
      
      {/* Tabla de Obras */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : obrasFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 font-medium">No se encontraron obras{busqueda ? ` que coincidan con "${busqueda}"` : ''}{filtroCategoria ? ` en la categoría "${filtroCategoria}"` : ''}.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">🎨 Obra</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">📂 Categoría</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">📅 Fecha</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">⚡ Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/50">
              {obrasPaginadas.map((obra) => (
                <tr key={obra.id} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-300 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-2xl mr-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                        <img 
                          src={obra.image || '/placeholder-image.jpg'} 
                          alt={obra.Nombre_obra}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 mb-1">{obra.Nombre_obra}</div>
                        <div className="text-sm text-gray-600 font-medium line-clamp-2">{obra.Descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-4 py-2 text-sm font-bold bg-gradient-to-r ${getCategoryColorClass(obra.Categoria)} rounded-2xl shadow-lg`}>
                      {getCategoryIcon(obra.Categoria)} {obra.Categoria}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-600">
                    {formatDate(obra.created_at)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleEliminar(obra.id, obra.image)}
                        className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-xl transition-all duration-300 font-semibold"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {!isLoading && !error && obrasFiltradas.length > 0 && (
        <div className="px-8 py-6 border-t border-purple-200/30 bg-gradient-to-r from-gray-50/50 to-purple-50/50 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600">
            📊 Mostrando <span className="font-bold text-purple-600">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, obrasFiltradas.length)}</span> de <span className="font-bold text-purple-600">{obrasFiltradas.length}</span> obras
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium border-2 border-purple-200 rounded-xl transition-all duration-300 shadow-lg ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              ← Anterior
            </button>
            
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              // Mostrar páginas alrededor de la actual
              let pageToShow;
              if (totalPages <= 3) {
                pageToShow = i + 1;
              } else if (currentPage === 1) {
                pageToShow = i + 1;
              } else if (currentPage === totalPages) {
                pageToShow = totalPages - 2 + i;
              } else {
                pageToShow = currentPage - 1 + i;
              }
              
              return (
                <button
                  key={pageToShow}
                  onClick={() => setCurrentPage(pageToShow)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                    currentPage === pageToShow
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25'
                      : 'border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 shadow-lg'
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium border-2 border-purple-200 rounded-xl transition-all duration-300 shadow-lg ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}