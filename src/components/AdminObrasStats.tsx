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
interface AdminStats {
  totalObras: number;
  obrasPorCategoria: Record<string, number>;
  ultimaObra: {
    Nombre_obra: string;
    created_at: string;
  } | null;
}

export default function AdminObrasStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalObras: 0,
    obrasPorCategoria: {},
    ultimaObra: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

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

        // 3. Obtener la última obra
        const { data: ultimasObras, error: ultimasError } = await supabase
          .from('Galeria')
          .select('Nombre_obra, created_at')
          .order('created_at', { ascending: false })
          .limit(1);

        if (ultimasError) throw new Error(`Error al obtener la última obra: ${ultimasError.message}`);

        setStats({
          totalObras: totalObras || 0,
          obrasPorCategoria,
          ultimaObra: ultimasObras && ultimasObras.length > 0 ? ultimasObras[0] : null
        });
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-emerald-200/30 shadow-2xl shadow-emerald-500/10 hover:shadow-3xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-600 mb-2 uppercase tracking-wider">Publicadas</p>
          {isLoading ? (
            <div className="animate-pulse h-8 w-16 bg-emerald-100 rounded mb-2"></div>
          ) : (
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalObras}</p>
          )}
          <p className="text-sm text-emerald-600 font-semibold flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Activas
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-amber-200/30 shadow-2xl shadow-amber-500/10 hover:shadow-3xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-amber-600 mb-2 uppercase tracking-wider">Categorías</p>
          {isLoading ? (
            <div className="animate-pulse h-8 w-16 bg-amber-100 rounded mb-2"></div>
          ) : (
            <p className="text-4xl font-bold text-gray-900 mb-2">{Object.keys(stats.obrasPorCategoria).length}</p>
          )}
          <p className="text-sm text-amber-600 font-semibold flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
            Disponibles
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-200/30 shadow-2xl shadow-purple-500/10 hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wider">Última Obra</p>
          {isLoading ? (
            <div className="animate-pulse h-8 w-full bg-purple-100 rounded mb-2"></div>
          ) : (
            <>
              <p className="text-lg font-bold text-gray-900 mb-2 truncate">{stats.ultimaObra?.Nombre_obra || 'N/A'}</p>
              <p className="text-sm text-purple-600 font-semibold">
                {stats.ultimaObra ? formatDate(stats.ultimaObra.created_at) : ''}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}