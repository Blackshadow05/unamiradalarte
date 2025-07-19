# REGLAS PARA PROYECTOS WEB CON ASTRO, TYPESCRIPT Y TAILWIND CSS

### MISIÓN: Construir aplicaciones web ultra-rápidas, mantenibles, accesibles y optimizadas para SEO. El rendimiento no es una opción, es el requisito principal.

---

## I. PRINCIPIOS FUNDAMENTALES (La Filosofía)

1. **Rendimiento Primero (Performance First):** Cada decisión debe priorizar la velocidad de carga y la interactividad. Objetivo: Core Web Vitals verdes y Lighthouse 95+ en Performance.
2. **Renderizado Estático y SSR según sea necesario:** Aprovecha el renderizado estático de Astro y sólo usa SSR cuando necesites datos dinámicos o pre-renderizado en el servidor.
3. **Todo es Componente:** La interfaz se construye con pequeños componentes, preferiblemente en `.astro` o integrando frameworks de UI solo cuando es necesario.
4. **Seguridad de Tipos Total:** TypeScript estricto obligatorio. Prohibido `any`, `unknown` solo cuando sea necesario. Todo tipado: props, APIs, estado, y datos.
5. **CSS Nativo Primero:** Si algo se puede hacer con CSS puro, NO uses JavaScript. Animaciones, transiciones, layouts responsive, hover effects: todo con CSS.
6. **Utility-First CSS:** Tailwind CSS directo en los archivos `.astro` o componentes. `@apply` solo para patrones muy repetitivos en `src/styles/globals.css`.

---

## II. ESTRUCTURA DEL PROYECTO (La Arquitectura)

src/
├── components/ // Componentes reutilizables (.astro, .tsx, etc.)
├── layouts/ // Layouts base (.astro)
├── pages/ // Páginas públicas en rutas
├── scripts/ // Scripts auxiliares, funcionalidad backend
├── styles/ // Estilos globales y personalizados
│ └── globals.css // Estilos globales + Tailwind
├── public/ // Recursos públicos (imágenes, fuentes, íconos)
│ ├── images/
│ ├── icons/
│ └── fonts/
astro.config.mjs // Configuración Astro
tsconfig.json // Configuración TypeScript

text

---

## III. COMPONENTES EN ASTRO

### 1. Componentes por Defecto

Astro renderiza por defecto en el servidor y genera HTML estático.

// src/components/ProductList.astro
import type { Product } from '../types';

interface Props {
category: string;
products: Product[];
}

const { products } = Astro.props;
<div class="grid grid-cols-1 md:grid-cols-3 gap-6"> {products.map(product => ( <ProductCard client:load product={product} /> ))} </div> ```
2. Componentes Cliente Solo Cuando Sea Necesario
Astro permite hidratar componentes con frameworks (React, Solid, Svelte, Vue):

text
// src/components/Counter.tsx (React)
import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

export default function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => setCount(c => c - 1)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        -
      </button>
      <span className="text-2xl font-bold">{count}</span>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        +
      </button>
    </div>
  );
}
En .astro con hidratación:

text
---
// src/pages/index.astro
import Counter from '../components/Counter.tsx';
---

<Counter client:load />
3. Tipado Estricto de Props
text
// src/components/Button.tsx
import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className,
  children,
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded focus:ring-2 focus:ring-offset-2 transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'secondary',
          'border border-gray-300 bg-white hover:bg-gray-50 focus:ring-blue-500': variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
}
IV. CSS NATIVO PRIMERO - PROHIBIDO JS PARA DISEÑO
❌ NUNCA hagas animaciones o estilos con JS si puedes evitarlo
✅ Usa animaciones CSS y personalizaciones en globals.css
text
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-in {
    animation-fill-mode: both;
  }
  
  .fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .slide-in-from-bottom-4 {
    animation: slide-in-from-bottom-4 0.3s ease-out;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-bottom-4 {
  from { 
    opacity: 0;
    transform: translateY(1rem);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
V. TAILWIND CSS
1. Clases Estáticas SIEMPRE
text
// Evita clases dinámicas en strings template. Usa funciones para mapear colores u opciones.
const getColorClass = (color: string) => {
  const colors = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
  } as const;
  return colors[color as keyof typeof colors] || 'text-gray-500';
};
2. Utility Function para Classes
text
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
3. Configuración Tailwind Optimizada
text
// tailwind.config.cjs o .js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{astro,js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
VI. RENDIMIENTO EN ASTRO
1. Optimización de Imágenes
Usa el componente oficial @astrojs/image para optimizar imágenes:

text
---
// src/components/OptimizedImage.astro
import { Image } from '@astrojs/image/components';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const { src, alt, width = 800, height = 600 } = Astro.props;
---

<Image 
  src={src} 
  alt={alt} 
  width={width} 
  height={height} 
  class="rounded-lg"
/>
2. Code Splitting y Componentes Cliente
Astro hidrata solo los componentes que lo necesitan (client:load, client:idle, client:visible).

text
---
import HeavyChart from '../components/HeavyChart.tsx';
---

<!-- Carga perezosa con hidratación sólo cuando sea visible -->
<HeavyChart client:visible />
3. Suspense para Loading States con Frameworks
Si tu componente React usa Suspense:

text
import { Suspense } from 'react';

// Dentro del componente React se puede usar Suspense normalmente
Al insertarlo en Astro: hidrata sólo cuando sea necesario.

VII. ACCESIBILIDAD (A11Y)
1. HTML Semántico
text
---
--- 
<main class="max-w-4xl mx-auto px-4 py-8">
  <article>
    <header>
      <h1 class="text-3xl font-bold mb-4">Título del Artículo</h1>
      <time dateTime="2024-01-15" class="text-gray-600">
        15 de enero, 2024
      </time>
    </header>
    <section class="prose prose-lg">
      <p>Contenido del artículo...</p>
    </section>
  </article>
</main>
2. Focus Management
Para modales en React hidratados en Astro:

text
'use client'
import { useRef, useEffect } from 'react';

export function Modal({ isOpen, onClose, children }) {
  const focusRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isOpen && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={focusRef}
          onClick={onClose}
          className="sr-only"
          aria-label="Cerrar modal"
        >
          Cerrar
        </button>
        {children}
      </div>
    </div>
  );
}
VIII. SEO Y METADATA
1. Metadata Config en Astro
Usa el frontmatter de archivos .astro y el head para SEO:

text
---
const title = 'Título de la Página';
const description = 'Descripción SEO optimizada';
---
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</head>

<body>
  <div>Contenido</div>
</body>
2. Structured Data
text
---
const product = {
  name: 'Producto Ejemplo',
  description: 'Descripción del producto',
  image: '/images/product.jpg',
  price: '99.99'
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'CRC'
  }
};
---
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
IX. VALIDACIÓN Y TIPOS
1. Zod para Validación
text
// src/lib/validations.ts
import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debe ser mayor de edad'),
});

export type UserFormData = z.infer<typeof userFormSchema>;
2. Validación en Endpoint
Si usas endpoints o API (con Astro Server Functions):

text
// src/pages/api/create-user.ts
import type { APIContext } from 'astro';
import { userFormSchema } from '../../lib/validations';

export async function post({ request }: APIContext) {
  const formData = await request.json();
  const parsed = userFormSchema.safeParse(formData);

  if (!parsed.success) {
    return new Response(JSON.stringify({ errors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  // lógica para crear usuario...

  return new Response(null, { status: 201 });
}
X. HERRAMIENTAS Y CONFIGURACIÓN
1. TypeScript Estricto
text
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
2. ESLint y Prettier
text
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
3. Scripts en package.json para Astro
text
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "format": "prettier --write .",
    "lint": "eslint . --ext .js,.ts,.jsx,.tsx,.astro"
  }
}
XI. REGLAS DE ORO
CSS PRIMERO: Si se puede hacer con CSS, NO uses JavaScript.

Render Estático por Defecto: Sólo carga código cliente donde sea necesario (client:* hydration).

Tipado Estricto: Prohibido any. Todo debe estar tipado.

Performance Crítico: Cada decisión debe considerar el impacto en rendimiento.

Accesibilidad No Opcional: HTML semántico y navegación por teclado siempre.

SEO Built-in: Metadata y structured data en cada página.

Componentes Pequeños: Una responsabilidad por componente.

Validación Robusta: Zod para schemas y validación de datos.

RECUERDA: El objetivo es crear aplicaciones web que sean increíblemente rápidas, accesibles, mantenibles y que brinden una experiencia de usuario excepcional. Cada línea de código debe contribuir a estos obj