'use client';

import { useState, useEffect } from 'react';
import { checkSupabaseConnection, checkArtworkRatingsTable, testArtworkRatingInsert } from '@/lib/supabase';

export function SupabaseDebug() {
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [tableStatus, setTableStatus] = useState<boolean | null>(null);
  const [insertStatus, setInsertStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      setLoading(true);
      
      // Verificar conexión general
      const connection = await checkSupabaseConnection();
      setConnectionStatus(connection);
      
      // Verificar tabla artwork_ratings
      const table = await checkArtworkRatingsTable();
      setTableStatus(table);
      
      // Si la tabla existe, probar inserción
      if (table) {
        const insert = await testArtworkRatingInsert();
        setInsertStatus(insert);
      }
      
      setLoading(false);
    }

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-sm">
        <h3 className="font-bold text-blue-800">🔍 Verificando Supabase...</h3>
        <p className="text-blue-600">Comprobando conexión y tablas...</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 max-w-sm shadow-lg">
      <h3 className="font-bold text-gray-800 mb-2">🔧 Estado de Supabase</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className={connectionStatus ? '✅' : '❌'}>
            {connectionStatus ? '✅' : '❌'}
          </span>
          <span className="text-sm">
            Conexión: {connectionStatus ? 'OK' : 'Error'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={tableStatus ? '✅' : '❌'}>
            {tableStatus ? '✅' : '❌'}
          </span>
          <span className="text-sm">
            Tabla artwork_ratings: {tableStatus ? 'Accesible' : 'No accesible'}
          </span>
        </div>
        
        {tableStatus && (
          <div className="flex items-center space-x-2">
            <span className={insertStatus ? '✅' : '❌'}>
              {insertStatus ? '✅' : '❌'}
            </span>
            <span className="text-sm">
              Permisos de inserción: {insertStatus ? 'OK' : 'Error'}
            </span>
          </div>
        )}
      </div>
      
      {!tableStatus && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p className="text-yellow-800">
            ⚠️ La tabla existe pero no es accesible. Ejecuta setup_artwork_ratings_permissions.sql
          </p>
        </div>
      )}
      
      {tableStatus && !insertStatus && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
          <p className="text-red-800">
            ❌ Problema de permisos. Ejecuta setup_artwork_ratings_permissions.sql
          </p>
        </div>
      )}
      
      {tableStatus && insertStatus && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
          <p className="text-green-800">
            ✅ Todo funciona correctamente. Puedes eliminar este componente de debug.
          </p>
        </div>
      )}
    </div>
  );
}