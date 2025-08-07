-- Configurar permisos para la tabla artwork_ratings existente

-- Habilitar Row Level Security si no está habilitado
ALTER TABLE public.artwork_ratings ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para evitar conflictos)
DROP POLICY IF EXISTS "Allow public read access" ON public.artwork_ratings;
DROP POLICY IF EXISTS "Allow public insert access" ON public.artwork_ratings;
DROP POLICY IF EXISTS "Allow update own ratings" ON public.artwork_ratings;
DROP POLICY IF EXISTS "Allow delete own ratings" ON public.artwork_ratings;

-- Crear políticas nuevas
-- Política para permitir lectura a todos
CREATE POLICY "Allow public read access" ON public.artwork_ratings
    FOR SELECT USING (true);

-- Política para permitir inserción a todos
CREATE POLICY "Allow public insert access" ON public.artwork_ratings
    FOR INSERT WITH CHECK (true);

-- Política para permitir actualización a todos (opcional, puedes restringir)
CREATE POLICY "Allow update own ratings" ON public.artwork_ratings
    FOR UPDATE USING (true);

-- Política para permitir eliminación a todos (opcional, puedes restringir)
CREATE POLICY "Allow delete own ratings" ON public.artwork_ratings
    FOR DELETE USING (true);

-- Verificar que la tabla tenga las columnas correctas
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'artwork_ratings' 
AND table_schema = 'public'
ORDER BY ordinal_position;