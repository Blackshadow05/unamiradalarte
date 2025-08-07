-- Script SQL para agregar columnas de múltiples tamaños de imagen
-- Ejecuta estos comandos en tu consola de Supabase SQL Editor

-- Agregar columnas para diferentes tamaños de imagen
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS image_thumbnail text;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS image_gallery text;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS image_detail text;

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Galeria' 
AND table_schema = 'public'
AND column_name LIKE 'image%'
ORDER BY ordinal_position;

-- Opcional: Migrar datos existentes (copiar la URL de 'image' a otros tamaños)
UPDATE public."Galeria" 
SET 
  image_gallery = image,
  image_detail = image
WHERE image IS NOT NULL 
AND (image_gallery IS NULL OR image_detail IS NULL);

-- Verificar la migración
SELECT 
  id, 
  "Nombre_obra",
  CASE WHEN image IS NOT NULL THEN '✓' ELSE '✗' END as "image",
  CASE WHEN image_thumbnail IS NOT NULL THEN '✓' ELSE '✗' END as "thumbnail",
  CASE WHEN image_gallery IS NOT NULL THEN '✓' ELSE '✗' END as "gallery",
  CASE WHEN image_detail IS NOT NULL THEN '✓' ELSE '✗' END as "detail"
FROM public."Galeria" 
ORDER BY created_at DESC 
LIMIT 5;