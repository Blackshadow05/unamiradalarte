-- Script para configurar políticas de seguridad para el bucket 'galeria'
-- Ejecuta estos comandos en tu consola de Supabase SQL Editor

-- Configurar políticas de seguridad para el bucket 'galeria'
-- Permitir que cualquiera pueda ver las imágenes (lectura pública)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'galeria');

-- Permitir subir imágenes (puedes ajustar esto según tus necesidades de autenticación)
CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galeria');

-- Permitir actualizar imágenes
CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE USING (bucket_id = 'galeria');

-- Permitir eliminar imágenes
CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE USING (bucket_id = 'galeria');

-- Verificar que el bucket existe
SELECT * FROM storage.buckets WHERE id = 'galeria';