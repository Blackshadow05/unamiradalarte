'use client';

import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Desestructurar desde React
const { useState, useEffect } = React;

// Crear cliente de Supabase con clave de servicio para omitir RLS
const supabaseUrl = 'https://cturqalloieehxxrqzsw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXJxYWxsb2llZWh4eHJxenN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1NTk5MywiZXhwIjoyMDY4NTMxOTkzfQ.q49OXJfmXaWwWj9xmJA-1QjGbHSZHI67-Tm3xVLnLh4';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tipos para las estadísticas
interface GaleriaStats {
  totalObras: number;
  obrasPorCategoria: Record<string, number>;
  ultimasObras: {
    id: number;
    Nombre_obra: string;
    Categoria: string;
    created_at: string;
    image: string;
  }[];
}

export default function GaleriaStats() {
  const [stats, setStats] = useState<GaleriaStats>({
    totalObras: 0,
    obrasPorCategoria: {},
    ultimasObras: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Obtener el total de obras
        const { count: totalObras, error: countError } = await supabase
          .from('Galeria')
          .select('*', { count: 'exact', head: true });

        if (countError) throw new Error(`Error al obtener el total de obras: ${countError.message}`);

        // 2. Obtener las obras por categoría
        const { data: obras, error: obrasError } = await supabase
          .from('Galeria')
          .select('Categoria');

        if (obrasError) throw new Error(`Error al obtener las obras: ${obrasError.message}`);

        // Contar obras por categoría
        const obrasPorCategoria: Record<string, number> = {};
        obras.forEach(obra => {
          const categoria = obra.Categoria || 'Sin categoría';
          obrasPorCategoria[categoria] = (obrasPorCategoria[categoria] || 0) + 1;
        });

        // 3. Obtener las últimas obras
        const { data: ultimasObras, error: ultimasError } = await supabase
          .from('Galeria')
          .select('id, Nombre_obra, Categoria, created_at, image')
          .order('created_at', { ascending: false })
          .limit(3);

        if (ultimasError) throw new Error(`Error al obtener las últimas obras: ${ultimasError.message}`);

        setStats({
          totalObras: totalObras || 0,
          obrasPorCategoria,
          ultimasObras: ultimasObras || []
        });
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
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

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Total Obras */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-200/30 shadow-2xl shadow-blue-500/10 hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Total Obras</p>
            {isLoading ? (
              <div className="animate-pulse h-8 w-16 bg-blue-100 rounded mb-2"></div>
            ) : (
              <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalObras}</p>
            )}
            <p className="text-sm text-emerald-600 font-semibold flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              En crecimiento
            </p>
          </div>
        </div>

        {/* Obras por Categoría */}
        {Object.entries(stats.obrasPorCategoria).slice(0, 3).map(([categoria, cantidad], index) => (
          <div key={categoria} className={`bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-200/30 shadow-2xl shadow-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-500/10 hover:shadow-3xl hover:shadow-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-500/20 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br from-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-50/50 to-${index === 0 ? 'green' : index === 1 ? 'yellow' : 'pink'}-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br from-${index === 0 ? 'emerald-500 via-green-600 to-teal-600' : index === 1 ? 'amber-500 via-yellow-600 to-orange-600' : 'purple-500 via-pink-600 to-rose-600'} rounded-2xl flex items-center justify-center shadow-xl shadow-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-500/25 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{getCategoryIcon(categoria)}</span>
                </div>
              </div>
              <p className={`text-sm font-semibold text-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-600 mb-2 uppercase tracking-wider`}>{categoria}</p>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-100 rounded mb-2"></div>
              ) : (
                <p className="text-4xl font-bold text-gray-900 mb-2">{cantidad}</p>
              )}
              <p className={`text-sm text-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-600 font-semibold flex items-center`}>
                <span className={`w-2 h-2 bg-${index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}-500 rounded-full mr-2 animate-pulse`}></span>
                Activas
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/30 shadow-2xl shadow-gray-500/10 overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="px-8 py-6 border-b border-gray-200/30 bg-gradient-to-r from-gray-50/50 to-purple-50/50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">Actividad Reciente</h3>
          <p className="text-sm text-gray-600 mt-1">Últimas obras agregadas</p>
        </div>
        <div className="p-8">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-6 p-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : stats.ultimasObras.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 font-medium">No hay obras recientes.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stats.ultimasObras.map((obra) => (
                <div key={obra.id} className="flex items-center space-x-6 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={obra.image || '/placeholder-image.jpg'} 
                      alt={obra.Nombre_obra}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900 mb-1">Nueva obra agregada</p>
                    <p className="text-sm text-gray-600">"{obra.Nombre_obra}" fue publicada exitosamente</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {getCategoryIcon(obra.Categoria)} {obra.Categoria}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(obra.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}