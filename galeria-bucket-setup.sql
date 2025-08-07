-- Ejecuta estos comandos UNO POR UNO en el SQL Editor de Supabase

-- 1. Hacer el bucket público
UPDATE storage.buckets SET public = true WHERE id = 'galeria';

-- 2. Crear política de lectura pública
CREATE POLICY "Galeria Public Access" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'galeria');

-- 3. Crear política para subir archivos
CREATE POLICY "Galeria Allow uploads" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'galeria');

-- 4. Crear política para actualizar archivos
CREATE POLICY "Galeria Allow updates" ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'galeria');

-- 5. Crear política para eliminar archivos
CREATE POLICY "Galeria Allow deletes" ON storage.objects 
FOR DELETE 
USING (bucket_id = 'galeria');

-- 6. Verificar que el bucket es público
SELECT id, name, public FROM storage.buckets WHERE id = 'galeria';