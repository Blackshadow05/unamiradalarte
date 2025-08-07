# Configuración de Supabase Storage para Imágenes

## Pasos para configurar el almacenamiento de imágenes:

### 1. Crear el bucket en Supabase Dashboard
1. Ve a tu proyecto de Supabase
2. Navega a **Storage** en el menú lateral
3. Haz clic en **Create bucket**
4. Nombre del bucket: `images`
5. Marca como **Public bucket** ✅
6. Haz clic en **Create bucket**

### 2. Configurar políticas de seguridad (Alternativa por UI)
1. En Storage, selecciona el bucket `galeria`
2. Ve a la pestaña **Policies**
3. Crea las siguientes políticas:

#### Política de Lectura (SELECT)
- **Name**: Public Access
- **Allowed operation**: SELECT
- **Target roles**: public
- **USING expression**: `bucket_id = 'galeria'`

#### Política de Inserción (INSERT)
- **Name**: Allow uploads
- **Allowed operation**: INSERT
- **Target roles**: public
- **WITH CHECK expression**: `bucket_id = 'galeria'`

#### Política de Actualización (UPDATE)
- **Name**: Allow updates
- **Allowed operation**: UPDATE
- **Target roles**: public
- **USING expression**: `bucket_id = 'galeria'`

#### Política de Eliminación (DELETE)
- **Name**: Allow deletes
- **Allowed operation**: DELETE
- **Target roles**: public
- **USING expression**: `bucket_id = 'galeria'`

### 3. Alternativa: Ejecutar SQL
Si prefieres usar SQL, ejecuta el archivo `setup-supabase-storage.sql` en el SQL Editor.

### 4. Verificar configuración
1. Ve a Storage > galeria
2. Intenta subir una imagen de prueba
3. Verifica que se puede acceder públicamente a la URL

## Estructura de archivos
Las imágenes se guardarán con esta estructura:
```
galeria/
  obras/
    [random-id]-[timestamp].jpg
    [random-id]-[timestamp].png
    ...
```

## Formatos soportados
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

## Límites
- Tamaño máximo por archivo: 50MB (configurable)
- Tipos MIME permitidos: image/*

## Seguridad
- Las imágenes son públicamente accesibles
- Los nombres de archivo son aleatorios para evitar conflictos
- Se incluye timestamp para unicidad