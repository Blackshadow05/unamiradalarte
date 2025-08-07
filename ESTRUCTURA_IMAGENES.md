# 📁 Estructura de Imágenes en Supabase Storage

## 🗂️ Organización del Bucket "galeria"

```
galeria/
└── obras/
    ├── thumbnail/
    │   ├── abc123-1234567890.jpg (200x250px)
    │   ├── def456-1234567891.jpg
    │   └── ...
    ├── gallery/
    │   ├── abc123-1234567890.jpg (400x500px)
    │   ├── def456-1234567891.jpg
    │   └── ...
    └── detail/
        ├── abc123-1234567890.jpg (600x750px)
        ├── def456-1234567891.jpg
        └── ...
```

## 📐 Tamaños de Imagen

| **Carpeta** | **Dimensiones** | **Calidad** | **Uso** |
|-------------|----------------|-------------|---------|
| `thumbnail/` | 200x250px | 80% | Miniaturas, listas |
| `gallery/` | 400x500px | 85% | Vista principal de galería |
| `detail/` | 600x750px | 90% | Modal de detalles |

## 🔄 Proceso Automático

### 1. **Subida de Imagen**
```javascript
// Usuario selecciona imagen
const file = selectedFile;

// Sistema genera automáticamente:
const imageUrls = await uploadImageWithSizes(file);
// Resultado:
// {
//   thumbnail: "https://...galeria/obras/thumbnail/abc123-1234567890.jpg",
//   gallery: "https://...galeria/obras/gallery/abc123-1234567890.jpg", 
//   detail: "https://...galeria/obras/detail/abc123-1234567890.jpg"
// }
```

### 2. **Almacenamiento en Base de Datos**
```sql
-- Tabla Galeria
image_thumbnail: "https://...thumbnail/abc123-1234567890.jpg"
image_gallery:   "https://...gallery/abc123-1234567890.jpg"
image_detail:    "https://...detail/abc123-1234567890.jpg"
image:           "https://...gallery/abc123-1234567890.jpg" -- Para compatibilidad
```

## 🎯 Ventajas de esta Estructura

### ✅ **Organización Clara**
- Cada tamaño en su carpeta específica
- Fácil identificación y mantenimiento
- Estructura escalable

### ✅ **Rendimiento Optimizado**
- Carga solo el tamaño necesario
- Menor uso de ancho de banda
- Experiencia de usuario mejorada

### ✅ **Gestión Eficiente**
- Fácil backup por tamaño
- Limpieza selectiva
- Monitoreo independiente

## 🛠️ Configuración Técnica

### **Nombres de Archivo**
- **Formato**: `{randomId}-{timestamp}.{extension}`
- **Ejemplo**: `abc123def-1234567890.jpg`
- **Unicidad**: Garantizada por timestamp + random

### **Rutas Completas**
```
obras/thumbnail/abc123def-1234567890.jpg
obras/gallery/abc123def-1234567890.jpg
obras/detail/abc123def-1234567890.jpg
```

### **URLs Públicas**
```
https://[proyecto].supabase.co/storage/v1/object/public/galeria/obras/thumbnail/abc123def-1234567890.jpg
https://[proyecto].supabase.co/storage/v1/object/public/galeria/obras/gallery/abc123def-1234567890.jpg
https://[proyecto].supabase.co/storage/v1/object/public/galeria/obras/detail/abc123def-1234567890.jpg
```

## 📊 Uso en la Aplicación

### **Galería Principal**
```jsx
<img src={artwork.image_gallery} alt={artwork.title} />
// Carga imagen de 400x500px optimizada para galería
```

### **Miniaturas/Listas**
```jsx
<img src={artwork.image_thumbnail} alt={artwork.title} />
// Carga imagen de 200x250px para carga rápida
```

### **Modal de Detalles**
```jsx
<img src={artwork.image_detail} alt={artwork.title} />
// Carga imagen de 600x750px para vista detallada
```

## 🔧 Mantenimiento

### **Limpieza de Archivos Huérfanos**
```sql
-- Encontrar registros sin imágenes
SELECT id, "Nombre_obra" 
FROM public."Galeria" 
WHERE "image_gallery" IS NULL;
```

### **Verificar Integridad**
```sql
-- Verificar que todas las obras tienen sus 3 tamaños
SELECT 
  id,
  "Nombre_obra",
  CASE WHEN "image_thumbnail" IS NOT NULL THEN '✓' ELSE '✗' END as thumbnail,
  CASE WHEN "image_gallery" IS NOT NULL THEN '✓' ELSE '✗' END as gallery,
  CASE WHEN "image_detail" IS NOT NULL THEN '✓' ELSE '✗' END as detail
FROM public."Galeria"
WHERE "image_gallery" IS NOT NULL;
```