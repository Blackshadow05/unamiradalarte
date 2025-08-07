-- Script para configurar correctamente las políticas del bucket 'galeria'
-- Ejecuta estos comandos en tu consola de Supabase SQL Editor

-- 1. Primero, eliminar políticas existentes si las hay (opcional)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;

-- 2. Crear políticas específicas para el bucket 'galeria'

-- Permitir lectura pública de imágenes
CREATE POLICY "Galeria Public Access" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'galeria');

-- Permitir subir imágenes (sin autenticación por ahora)
CREATE POLICY "Galeria Allow uploads" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'galeria');

-- Permitir actualizar imágenes
CREATE POLICY "Galeria Allow updates" ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'galeria');

-- Permitir eliminar imágenes
CREATE POLICY "Galeria Allow deletes" ON storage.objects 
FOR DELETE 
USING (bucket_id = 'galeria');

-- 3. Verificar que el bucket existe y es público
SELECT id, name, public FROM storage.buckets WHERE id = 'galeria';

-- 4. Si el bucket no es público, hacerlo público
UPDATE storage.buckets SET public = true WHERE id = 'galeria';

-- 5. Verificar las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';