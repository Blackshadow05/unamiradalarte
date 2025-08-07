import { supabase } from './supabase';
import { Artwork, Review } from '@/types';

// Tipos para la tabla Galeria (compatibilidad con /dashboard/obras)
export interface GaleriaItem {
  id: number;
  created_at: string;
  Nombre_obra: string | null;
  Descripcion: string | null;
  Categoria: string | null;
  image: string | null;
  image_thumbnail: string | null;
  image_gallery: string | null;
  image_detail: string | null;
  Año: number | null;
  Dimensiones: string | null;
  Tecnica: string | null;
  Tiempo_creacion: string | null;
  Materiales: string | null;
  Inspiracion: string | null;
  Estado: string | null;
  Precio: number | null;
}

/**
 * Compat: funciones requeridas por /dashboard/obras
 */
export async function checkBucketConfiguration() {
  const { error } = await supabase.storage
    .from('galeria')
    .list('obras', { limit: 1 });
  return !error;
}

export async function checkTableStructure() {
  const { data, error } = await supabase
    .from('Galeria')
    .select('*')
    .limit(1);
  if (error) return null;
  return data;
}

export async function getGaleriaItems() {
  const { data, error } = await supabase
    .from('Galeria')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as GaleriaItem[];
}

export async function deleteGaleriaItem(id: number) {
  const { error } = await supabase
    .from('Galeria')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const filePath = parts.slice(-2).join('/'); // obras/filename.ext
    const { error } = await supabase.storage
      .from('galeria')
      .remove([filePath]);
    if (error) throw error;
  } catch {
    // ignorar errores de parseo
  }
}

/**
 * Utilidades de "Movimientos"
 * Nuevo enfoque: insertar una fila por cada visita.
 * - created_at: fecha-hora local del dispositivo (formato: YYYY-MM-DD HH:mm:ss)
 * - Visitas_hoy: 1 por cada visita insertada
 * - Total_visitas: acumulado hasta antes de la inserción + 1
 */
function getTodayKeyLocal(): string {
  // YYYY-MM-DD usando fecha local del dispositivo (sin zona horaria)
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Obtiene el total acumulado hasta ahora (último Total_visitas)
async function getLastTotalVisitas(): Promise<number> {
  const { data, error } = await supabase
    .from('Movimientos')
    .select('"Total_visitas"')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return Number(data?.Total_visitas ?? 0);
}

/**
 * Inserta una nueva fila representando una visita individual.
 * Devuelve el nuevo Total_visitas después de la inserción.
 */
export async function addVisitRow(): Promise<{ total: number; created_at: string }> {
  const lastTotal = await getLastTotalVisitas();

  // Fecha y hora local del dispositivo en formato 'YYYY-MM-DD HH:mm:ss' sin TZ
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const localDateTime = `${y}-${mo}-${d} ${hh}:${mm}:${ss}`;

  const insertPayload = {
    created_at: localDateTime,
    'Visitas_hoy': 1,
    'Total_visitas': lastTotal + 1
  };

  const { data, error } = await supabase
    .from('Movimientos')
    .insert(insertPayload)
    .select('created_at, "Total_visitas"')
    .maybeSingle();

  if (error) throw error;

  return {
    total: Number(data?.Total_visitas ?? lastTotal + 1),
    created_at: data?.created_at ?? localDateTime
  };
}
 
/**
 * Lee el total acumulado como el número total de filas con Visitas_hoy = 1 (independiente de fecha).
 */
export async function readTotalVisits(): Promise<number> {
  // Seleccionar solo IDs por ligereza y contar en cliente
  const { data, error } = await supabase
    .from('Movimientos')
    .select('id')
    .eq('Visitas_hoy', 1);
 
  if (error) throw error;
  return Array.isArray(data) ? data.length : 0;
}

/**
 * Lee cuántas visitas se han realizado hoy (sumando filas del día).
 */
export async function readTodayVisits(): Promise<number> {
  // Construir rango del día usando fecha local del dispositivo sin TZ
  const today = getTodayKeyLocal();
  const start = `${today} 00:00:00`;
  const end = `${today} 23:59:59`;

  // Traer IDs y contar en cliente (compatibilidad navegador)
  const { data, error } = await supabase
    .from('Movimientos')
    .select('id')
    .gte('created_at', start)
    .lte('created_at', end)
    .eq('Visitas_hoy', 1);

  if (error) throw error;

  return Array.isArray(data) ? data.length : 0;
}