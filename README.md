# 🎨 Una Mirada al Arte

Un sitio web moderno y elegante para una artista, construido con las últimas tecnologías web para mostrar obras de arte, amigurumis y crear una experiencia visual excepcional.

## ✨ Características Principales

### 🖼️ **Galería Interactiva**
- Modal detallado para cada obra con información completa
- Sistema de filtros por categoría (Óleo, Acuarela, Técnica Mixta, Amigurumi)
- Efectos hover y animaciones suaves
- Diseño responsive para todos los dispositivos

### ⭐ **Sistema de Calificaciones**
- Calificación por estrellas (1-5)
- Comentarios y reseñas de usuarios
- Formulario interactivo para nuevas reseñas
- Verificación de reseñas auténticas

### 🧸 **Sección de Amigurumis**
- Categoría especializada para obras tejidas
- Detalles técnicos de crochet
- Información de materiales y herramientas
- Precios accesibles para artesanías

### 📱 **Experiencia Móvil Optimizada**
- Navegación responsive con menú hamburguesa
- Modales adaptados para dispositivos táctiles
- Formularios optimizados para móviles
- Rendimiento excepcional en todos los dispositivos

## 🚀 Tecnologías Utilizadas

- **[Astro](https://astro.build/)** - Framework web moderno con renderizado estático
- **[React](https://reactjs.org/)** - Componentes interactivos donde es necesario
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estricto para mayor robustez
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos utility-first para diseño rápido
- **CSS Puro** - Animaciones y efectos sin JavaScript innecesario

## 🎨 Paleta de Colores

- **Primario**: Naranjas cálidos (#e67e22, #d35400)
- **Secundario**: Azules profundos (#0ea5e9, #0369a1)
- **Acento**: Rosas suaves (#ec4899)
- **Gradientes**: Combinaciones artísticas de azul a naranja

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.astro
│   ├── Navigation.tsx
│   ├── Hero.astro
│   ├── ArtworkCardInteractive.tsx
│   ├── ArtworkModal.tsx
│   └── Footer.astro
├── layouts/            # Layouts base
│   └── Layout.astro
├── pages/              # Páginas del sitio
│   ├── index.astro     # Página principal
│   ├── galeria.astro   # Galería completa
│   ├── sobre-mi.astro  # Historia de la artista
│   ├── exposiciones.astro
│   └── contacto.astro
├── styles/             # Estilos globales
│   └── globals.css
├── types/              # Definiciones TypeScript
│   └── index.ts
└── lib/                # Utilidades
    └── utils.ts

public/
├── images/             # Imágenes de obras y amigurumis
├── favicon.svg
└── og-image.svg
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Blackshadow05/unamiradalarte.git

# Navegar al directorio
cd unamiradalarte

# Instalar dependencias
npm install
```

### Desarrollo
```bash
# Servidor de desarrollo
npm run dev

# Servidor accesible desde red local (móviles)
npm run dev:mobile

# Build para producción
npm run build

# Preview del build
npm run preview
```

### URLs de Desarrollo
- **Local**: `http://localhost:4321/`
- **Red Local**: `http://[TU_IP]:4321/` (para acceso desde móviles)

## 📄 Páginas Disponibles

1. **Inicio** (`/`) - Hero impactante + obras destacadas + sobre la artista
2. **Galería** (`/galeria`) - Todas las obras con filtros y modal interactivo
3. **Sobre mí** (`/sobre-mi`) - Historia, filosofía y timeline de la artista
4. **Exposiciones** (`/exposiciones`) - Historial de exposiciones y eventos
5. **Contacto** (`/contacto`) - Formulario de contacto + información

## 🎯 Características Técnicas

### Performance
- ✅ Renderizado estático con Astro
- ✅ Hidratación selectiva de componentes
- ✅ Optimización de imágenes SVG
- ✅ CSS minificado y optimizado
- ✅ Core Web Vitals optimizados

### SEO
- ✅ Meta tags completos
- ✅ Open Graph para redes sociales
- ✅ Structured data (JSON-LD)
- ✅ URLs semánticas
- ✅ Sitemap automático

### Accesibilidad
- ✅ HTML semántico
- ✅ Navegación por teclado
- ✅ Contraste de colores optimizado
- ✅ Alt text en imágenes
- ✅ ARIA labels donde es necesario

## 🌟 Funcionalidades Destacadas

### Modal de Obras
- Información detallada de cada pieza
- Técnicas y materiales utilizados
- Historia e inspiración de la obra
- Sistema de calificaciones integrado
- Formulario de comentarios

### Sistema de Filtros
- Filtrado por categoría en tiempo real
- Animaciones suaves entre transiciones
- Mantiene el estado de filtros
- Responsive en todos los dispositivos

### Formulario de Contacto
- Validación en tiempo real
- Campos específicos por tipo de consulta
- Información de contacto actualizada (Costa Rica)
- Diseño accesible y user-friendly

## 📞 Información de Contacto

- **Ubicación**: San José, Costa Rica
- **Teléfono**: +506 8383-8383
- **Email**: info@unamiradaalarte.com

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Diseño inspirado en las mejores prácticas de sitios web de arte
- Paleta de colores cuidadosamente seleccionada para transmitir calidez artística
- Iconos y elementos visuales optimizados para la experiencia del usuario

---

**Desarrollado con ❤️ para artistas que quieren mostrar su trabajo al mundo**