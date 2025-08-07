-- Script SQL para actualizar la tabla Galeria con los nuevos campos
-- Ejecuta estos comandos en tu consola de Supabase SQL Editor

-- Agregar las nuevas columnas a la tabla existente
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS "Año" integer;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS "Dimensiones" text;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS "Tecnica" text;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS "Tiempo_creacion" text;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS "Materiales" text;
ALTER TABLE public."Galeria" ADD COLUMN IF NOT EXISTS "Inspiracion" text;

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Galeria' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ejemplo de inserción con todos los campos nuevos
INSERT INTO public."Galeria" (
  "Nombre_obra",
  "Descripcion", 
  "Categoria",
  "image",
  "Año",
  "Dimensiones",
  "Tecnica",
  "Tiempo_creacion",
  "Materiales",
  "Inspiracion"
) VALUES (
  'Cactus en Maceta',
  'Una hermosa representación de la resistencia natural de los cactus',
  'Pintura',
  'https://ejemplo.com/cactus.jpg',
  2024,
  '25x35 cm',
  'Acrílico',
  '1 semana',
  'Acrílico, Lienzo pequeño',
  'La belleza está en la simplicidad y resistencia de estas plantas.'
);

-- Verificar que la inserción funcionó
SELECT * FROM public."Galeria" ORDER BY created_at DESC LIMIT 1;

-- Opcional: Si quieres actualizar registros existentes con datos de ejemplo
-- UPDATE public."Galeria" 
-- SET 
--   "Año" = 2024,
--   "Dimensiones" = '30x40 cm',
--   "Tecnica" = 'Óleo',
--   "Tiempo_creacion" = '2 semanas',
--   "Materiales" = 'Óleo, Lienzo',
--   "Inspiracion" = 'Inspirado en la naturaleza'
-- WHERE "Año" IS NULL;