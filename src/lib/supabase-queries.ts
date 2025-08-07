import { supabase } from './supabase';
import { Artwork, Review } from '@/types';

// Tipos para la tabla Galeria (compatibilidad con /dashboard/obras)
// Nota: se mantienen campos legacy para compatibilidad de lectura con registros antiguos
export interface GaleriaItem {
  id: number;
  created_at: string;
  Nombre_obra: string | null;
  Descripcion: string | null;
  Categoria: string | null;
  // Legacy (pueden existir en registros antiguos)
  image: string | null;
  image_thumbnail: string | null;
  image_gallery: string | null;
  image_detail: string | null;
  // Nuevos campos solicitados
  Imagen_horizontal?: string | null;
  Imagen_vertitical?: string | null; // nombre exacto según DDL
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
  if (error) {
    console.error('Supabase getGaleriaItems error:', error);
    throw error;
  }
  return data as GaleriaItem[];
}

/**
 * Inserta una nueva obra en Galeria.
 * Acepta un objeto parcial con los campos permitidos.
 */
export async function createGaleriaItem(payload: Partial<GaleriaItem> & {
  Imagen_horizontal?: string | null;
  Imagen_vertitical?: string | null;
}): Promise<GaleriaItem> {
  // Construir fecha local del dispositivo sin zona horaria: 'YYYY-MM-DD HH:mm:ss'
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const localDateTime = `${y}-${mo}-${d} ${hh}:${mm}:${ss}`;

  // Mapeo EXPLÍCITO a columnas exactas, incluyendo created_at
  const mapped: Record<string, any> = { created_at: localDateTime };

  // Campos de texto
  if (payload.Nombre_obra) mapped['Nombre_obra'] = payload.Nombre_obra;
  if (payload.Descripcion) mapped['Descripcion'] = payload.Descripcion;
  if (payload.Categoria) mapped['Categoria'] = payload.Categoria;
  if ((payload as any).Estado) mapped['Estado'] = (payload as any).Estado;
  if ((payload as any).Dimensiones) mapped['Dimensiones'] = (payload as any).Dimensiones;
  if ((payload as any).Tecnica) mapped['Tecnica'] = (payload as any).Tecnica;
  if ((payload as any).Tiempo_creacion) mapped['Tiempo_creacion'] = (payload as any).Tiempo_creacion;
  if ((payload as any).Materiales) mapped['Materiales'] = (payload as any).Materiales;
  if ((payload as any).Inspiracion) mapped['Inspiracion'] = (payload as any).Inspiracion;

  // Números
  if (payload.Año !== undefined && payload.Año !== null && !Number.isNaN(payload.Año)) {
    mapped['Año'] = payload.Año;
  }

  // Precio es TEXT según tu DDL
  if ((payload as any).Precio !== undefined && (payload as any).Precio !== null && String((payload as any).Precio).trim() !== '') {
    mapped['Precio'] = String((payload as any).Precio);
  }

  // Imagen principal legacy (si existiera)
  if ((payload as any).image) mapped['image'] = (payload as any).image;

  // Nuevas columnas de imágenes
  if (payload.Imagen_horizontal) mapped['Imagen_horizontal'] = payload.Imagen_horizontal;
  if (payload.Imagen_vertitical) mapped['Imagen_vertitical'] = payload.Imagen_vertitical;

  const { data, error } = await supabase
    .from('Galeria')
    .insert(mapped)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase createGaleriaItem error:', error, 'payload:', mapped);
    throw error;
  }
  return data as GaleriaItem;
}

/**
 * Actualiza una obra por id en Galeria.
 */
export async function updateGaleriaItem(id: number, payload: Partial<GaleriaItem> & {
  Imagen_horizontal?: string | null;
  Imagen_vertitical?: string | null;
}): Promise<GaleriaItem> {
  const mapped: Record<string, any> = {};

  if (payload.Nombre_obra !== undefined) mapped['Nombre_obra'] = payload.Nombre_obra;
  if (payload.Descripcion !== undefined) mapped['Descripcion'] = payload.Descripcion;
  if (payload.Categoria !== undefined) mapped['Categoria'] = payload.Categoria;
  if (payload.Imagen_horizontal !== undefined) mapped['Imagen_horizontal'] = payload.Imagen_horizontal;
  if (payload.Imagen_vertitical !== undefined) mapped['Imagen_vertitical'] = payload.Imagen_vertitical;

  if (payload.Año !== undefined && payload.Año !== null && !Number.isNaN(payload.Año)) {
    mapped['Año'] = payload.Año;
  }

  if ((payload as any).Dimensiones !== undefined) mapped['Dimensiones'] = (payload as any).Dimensiones;
  if ((payload as any).Tecnica !== undefined) mapped['Tecnica'] = (payload as any).Tecnica;
  if ((payload as any).Tiempo_creacion !== undefined) mapped['Tiempo_creacion'] = (payload as any).Tiempo_creacion;
  if ((payload as any).Materiales !== undefined) mapped['Materiales'] = (payload as any).Materiales;
  if ((payload as any).Inspiracion !== undefined) mapped['Inspiracion'] = (payload as any).Inspiracion;

  if ((payload as any).Estado !== undefined) mapped['Estado'] = (payload as any).Estado;

  // "Precio" es text en tu DDL; lo convertimos a string si viene numérico
  if ((payload as any).Precio !== undefined && (payload as any).Precio !== null) {
    mapped['Precio'] = String((payload as any).Precio);
  }

  if ((payload as any).image !== undefined) mapped['image'] = (payload as any).image;

  const { data, error } = await supabase
    .from('Galeria')
    .update(mapped)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase updateGaleriaItem error:', error, 'payload:', mapped);
    throw error;
  }
  return data as GaleriaItem;
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
    // encontrar el segmento '/object/public/galeria/' y recuperar lo que sigue
    const idx = parts.findIndex(p => p === 'galeria');
    const filePath = idx >= 0 ? parts.slice(idx + 1).join('/') : parts.slice(-2).join('/'); // obras/filename.ext
    const { error } = await supabase.storage
      .from('galeria')
      .remove([filePath]);
    if (error) throw error;
  } catch {
    // ignorar errores de parseo
  }
}

/**
 * Sube un archivo (sin redimensionar) al bucket 'galeria/obras'
 * y devuelve la URL pública directa al archivo.
 * - Asegura path correcto: obras/{timestamp_random.ext}
 * - Devuelve la URL firmada pública (si el bucket es público, es una URL pública estándar)
 */
export async function uploadSingleImage(file: File): Promise<string> {
  const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  const fileExt = safeName.includes('.') ? safeName.split('.').pop() : 'jpg';
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const fileName = `${unique}.${fileExt}`;
  const path = `obras/${fileName}`;

  // Importante en navegador: convertir File a ArrayBuffer para asegurar compatibilidad
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('galeria')
    .upload(path, new Blob([arrayBuffer], { type: file.type || 'image/jpeg' }), {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg'
    });

  if (uploadError) {
    console.error('Error subiendo a storage:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('galeria').getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen');
  }
  return data.publicUrl;
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