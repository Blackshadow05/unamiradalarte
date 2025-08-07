# Configuración de Supabase para Una Mirada al Arte

Este documento describe cómo configurar Supabase para el proyecto "Una Mirada al Arte".

## Credenciales

Las credenciales de Supabase están almacenadas en el archivo `.env.local` y **NO** deben ser compartidas ni subidas al repositorio.

```
NEXT_PUBLIC_SUPABASE_URL=https://cturqalloieehxxrqzsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Estructura de la Base de Datos

El esquema de la base de datos se encuentra en el archivo `supabase-schema.sql`. Las principales tablas son:

1. **artworks**: Almacena todas las obras de arte
2. **reviews**: Almacena las reseñas de las obras
3. **contact_messages**: Almacena los mensajes del formulario de contacto
4. **health_check**: Tabla simple para verificar la conexión

## Configuración Inicial

Para configurar Supabase por primera vez:

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Copia la URL y la clave anónima a tu archivo `.env.local`
4. Ejecuta el script SQL en el editor SQL de Supabase

## Uso en el Proyecto

### Cliente de Supabase

El cliente de Supabase está configurado en `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Hook de React

Para usar Supabase en componentes de React, utiliza el hook `useSupabase`:

```typescript
import { useSupabase } from '@/hooks/useSupabase';

function MyComponent() {
  const { supabase, isConnected, isLoading, error } = useSupabase();
  
  // Usar supabase aquí
}
```

### Consultas Comunes

Las consultas comunes están en `src/lib/supabase-queries.ts`:

```typescript
import { getArtworks, getFeaturedArtworks, getArtworksByCategory } from '@/lib/supabase-queries';

// Obtener obras destacadas
const featuredArtworks = await getFeaturedArtworks(3);
```

## Seguridad

- Las claves de Supabase están en `.env.local` que está en `.gitignore`
- La clave anónima tiene permisos limitados
- Se utilizan RLS (Row Level Security) para proteger los datos

## Políticas de RLS Recomendadas

Para configurar RLS en Supabase:

1. Habilita RLS para todas las tablas
2. Configura políticas para permitir lectura pública pero escritura controlada

Ejemplo para la tabla `artworks`:

```sql
-- Permitir lectura a todos
CREATE POLICY "Permitir lectura pública de obras" 
ON artworks FOR SELECT 
USING (true);

-- Permitir escritura solo a usuarios autenticados con rol específico
CREATE POLICY "Permitir escritura solo a administradores" 
ON artworks FOR INSERT 
USING (auth.role() = 'authenticated' AND auth.email() = 'admin@unamiradaalarte.com');
```