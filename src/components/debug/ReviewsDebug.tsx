'use client';

import { useState, useEffect } from 'react';
import { getAllArtworkRatings, checkArtworkRatingsTable, insertSampleReviews } from '@/lib/supabase';
import { ArtworkRating } from '@/types';

export function ReviewsDebug() {
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [rawData, setRawData] = useState<ArtworkRating[]>([]);

  useEffect(() => {
    async function checkStatus() {
      setLoading(true);
      setLastError(null);
      
      try {
        // Verificar si la tabla existe
        const tableStatus = await checkArtworkRatingsTable();
        setTableExists(tableStatus);
        
        if (tableStatus) {
          // Obtener conteo de reseñas
          const reviews = await getAllArtworkRatings();
          setReviewCount(reviews.length);
          setRawData(reviews);
        }
      } catch (error) {
        console.error('Error en ReviewsDebug:', error);
        setLastError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  const handleInsertSamples = async () => {
    try {
      setLoading(true);
      const success = await insertSampleReviews();
      if (success) {
        const reviews = await getAllArtworkRatings();
        setReviewCount(reviews.length);
        setRawData(reviews);
      }
    } catch (error) {
      console.error('Error al insertar muestras:', error);
      setLastError(error instanceof Error ? error.message : 'Error al insertar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-sm z-50">
        <h3 className="font-bold text-blue-800">🔍 Verificando reseñas...</h3>
        <p className="text-blue-600">Comprobando base de datos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 max-w-sm shadow-lg z-50">
        <h3 className="font-bold text-gray-800 mb-2">🔧 Debug Reseñas</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className={tableExists ? '✅' : '❌'}>
              {tableExists ? '✅' : '❌'}
            </span>
            <span>Tabla: {tableExists ? 'Accesible' : 'No accesible'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={reviewCount !== null && reviewCount > 0 ? '✅' : '⚠️'}>
              {reviewCount !== null && reviewCount > 0 ? '✅' : '⚠️'}
            </span>
            <span>Reseñas: {reviewCount ?? 'N/A'}</span>
          </div>
          
          {lastError && (
            <div className="text-red-600 text-xs">
              Error: {lastError}
            </div>
          )}
        </div>
        
        <div className="mt-3 space-y-2">
          {tableExists && reviewCount === 0 && (
            <button
              onClick={handleInsertSamples}
              className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Insertar Ejemplos
            </button>
          )}
          
          {reviewCount && reviewCount > 0 && (
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="w-full px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              {showRawData ? 'Ocultar' : 'Ver'} Datos Raw
            </button>
          )}
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Página: /ratings
        </div>
      </div>

      {/* Modal con datos raw */}
      {showRawData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold">Datos Raw de artwork_ratings</h3>
              <button
                onClick={() => setShowRawData(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              <div className="text-sm mb-4">
                <strong>Total de registros:</strong> {rawData.length}
              </div>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}