'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export function useSupabase() {
  const [client] = useState<SupabaseClient>(supabase);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsLoading(true);
        const { data, error } = await client.from('health_check').select('*').limit(1).maybeSingle();
        
        if (error) {
          console.error('Error al conectar con Supabase:', error);
          setError(error);
          setIsConnected(false);
        } else {
          console.log('Conexión con Supabase establecida correctamente');
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error al verificar la conexión con Supabase:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkConnection();
  }, [client]);

  return { supabase: client, isConnected, isLoading, error };
}