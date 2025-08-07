\# REGLAS CURSOR: NEXT.JS + TYPESCRIPT + TAILWIND CSS



\## PRINCIPIOS FUNDAMENTALES



1\. \*\*Performance First\*\*: Core Web Vitals verdes, Lighthouse 95+

2\. \*\*CSS NATIVO SIEMPRE\*\*: PROHIBIDO JavaScript para estilos/animaciones

3\. \*\*React Sin Límites\*\*: Usa todos los hooks, patrones y funcionalidades

4\. \*\*Tailwind Completo\*\*: Explota clases dinámicas, variantes, plugins

5\. \*\*TypeScript Estricto\*\*: Tipado fuerte, evita `any`



\## ESTRUCTURA PROYECTO



```

src/

├── app/              // App Router Next.js 14+

├── components/       // Componentes reutilizables

│   ├── ui/          // Sistema diseño

│   ├── sections/    // Secciones completas

│   └── forms/       // Formularios

├── lib/             // Utilidades

├── hooks/           // Custom hooks

├── types/           // Tipos TypeScript

└── styles/          // CSS adicional

```



\## REACT PATTERNS



\### Server Components (Default)

```tsx

export default async function ProductList({ category }: { category: string }) {

&nbsp; const products = await getProducts(category);

&nbsp; 

&nbsp; return (

&nbsp;   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

&nbsp;     {products.map(product => (

&nbsp;       <ProductCard key={product.id} product={product} />

&nbsp;     ))}

&nbsp;   </div>

&nbsp; );

}

```



\### Client Components (Interactividad)

```tsx

'use client'

import { useState, useCallback } from 'react';



export function InteractiveSearch({ onSearch }: { onSearch: (q: string) => void }) {

&nbsp; const \[query, setQuery] = useState('');

&nbsp; 

&nbsp; const handleSearch = useCallback((value: string) => {

&nbsp;   setQuery(value);

&nbsp;   onSearch(value);

&nbsp; }, \[onSearch]);



&nbsp; return (

&nbsp;   <input

&nbsp;     value={query}

&nbsp;     onChange={(e) => handleSearch(e.target.value)}

&nbsp;     className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"

&nbsp;   />

&nbsp; );

}

```



\### Compound Components

```tsx

const TabsContext = createContext<{ active: string; setActive: (tab: string) => void } | null>(null);



export function Tabs({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) {

&nbsp; const \[active, setActive] = useState(defaultValue);

&nbsp; return (

&nbsp;   <TabsContext.Provider value={{ active, setActive }}>

&nbsp;     {children}

&nbsp;   </TabsContext.Provider>

&nbsp; );

}



export function TabsList({ children }: { children: React.ReactNode }) {

&nbsp; return <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">{children}</div>;

}

```



\## TAILWIND CSS AVANZADO



\### Clases Dinámicas

```tsx

interface BadgeProps {

&nbsp; variant: 'success' | 'error' | 'warning';

&nbsp; children: React.ReactNode;

}



export function Badge({ variant, children }: BadgeProps) {

&nbsp; return (

&nbsp;   <span className={cn(

&nbsp;     "px-3 py-1 text-sm font-medium rounded-full",

&nbsp;     {

&nbsp;       'bg-green-100 text-green-800': variant === 'success',

&nbsp;       'bg-red-100 text-red-800': variant === 'error',

&nbsp;       'bg-yellow-100 text-yellow-800': variant === 'warning',

&nbsp;     }

&nbsp;   )}>

&nbsp;     {children}

&nbsp;   </span>

&nbsp; );

}

```



\### Responsive + Hover Effects

```tsx

export function Card({ children }: { children: React.ReactNode }) {

&nbsp; return (

&nbsp;   <div className="

&nbsp;     group relative overflow-hidden rounded-2xl bg-white shadow-sm border

&nbsp;     hover:shadow-2xl hover:-translate-y-1 hover:scale-\[1.02]

&nbsp;     transition-all duration-300 ease-out

&nbsp;     focus-within:ring-2 focus-within:ring-blue-500

&nbsp;   ">

&nbsp;     {children}

&nbsp;   </div>

&nbsp; );

}

```



\## CSS ANIMACIONES (GLOBALS.CSS)



```css

@tailwind base;

@tailwind components;

@tailwind utilities;



@layer utilities {

&nbsp; .animate-slide-up {

&nbsp;   animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);

&nbsp; }

&nbsp; 

&nbsp; .animate-fade-in-blur {

&nbsp;   animation: fade-in-blur 0.6s cubic-bezier(0.16, 1, 0.3, 1);

&nbsp; }

&nbsp; 

&nbsp; .gradient-animation {

&nbsp;   background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);

&nbsp;   background-size: 400% 400%;

&nbsp;   animation: gradient-shift 15s ease infinite;

&nbsp; }

}



@keyframes slide-up {

&nbsp; from { opacity: 0; transform: translateY(40px); }

&nbsp; to { opacity: 1; transform: translateY(0); }

}



@keyframes fade-in-blur {

&nbsp; from { opacity: 0; filter: blur(10px); }

&nbsp; to { opacity: 1; filter: blur(0); }

}



@keyframes gradient-shift {

&nbsp; 0%, 100% { background-position: 0% 50%; }

&nbsp; 50% { background-position: 100% 50%; }

}

```



\## TAILWIND CONFIG



```js

module.exports = {

&nbsp; content: \['./src/\*\*/\*.{js,ts,jsx,tsx,mdx}'],

&nbsp; darkMode: \['class'],

&nbsp; theme: {

&nbsp;   extend: {

&nbsp;     colors: {

&nbsp;       primary: {

&nbsp;         50: '#eff6ff',

&nbsp;         500: '#3b82f6',

&nbsp;         900: '#1e3a8a',

&nbsp;       },

&nbsp;     },

&nbsp;     animation: {

&nbsp;       'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

&nbsp;       'fade-in': 'fade-in 0.3s ease-out',

&nbsp;     },

&nbsp;     keyframes: {

&nbsp;       'slide-up': {

&nbsp;         from: { opacity: 0, transform: 'translateY(40px)' },

&nbsp;         to: { opacity: 1, transform: 'translateY(0)' },

&nbsp;       },

&nbsp;     },

&nbsp;   },

&nbsp; },

&nbsp; plugins: \[

&nbsp;   require('@tailwindcss/typography'),

&nbsp;   require('@tailwindcss/forms'),

&nbsp; ],

};

```



\## PERFORMANCE



\### Imágenes Optimizadas

```tsx

import Image from 'next/image';



export function OptimizedImage({ src, alt, width, height }: {

&nbsp; src: string; alt: string; width: number; height: number;

}) {

&nbsp; return (

&nbsp;   <Image

&nbsp;     src={src}

&nbsp;     alt={alt}

&nbsp;     width={width}

&nbsp;     height={height}

&nbsp;     placeholder="blur"

&nbsp;     blurDataURL="data:image/jpeg;base64,..."

&nbsp;     className="transition-transform hover:scale-105"

&nbsp;     sizes="(max-width: 768px) 100vw, 50vw"

&nbsp;   />

&nbsp; );

}

```



\### Dynamic Imports

```tsx

import dynamic from 'next/dynamic';



const HeavyChart = dynamic(() => import('./HeavyChart'), {

&nbsp; loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,

&nbsp; ssr: false,

});

```



\## VALIDACIÓN ZOD



```tsx

import { z } from 'zod';



export const userSchema = z.object({

&nbsp; name: z.string().min(2, 'Mínimo 2 caracteres'),

&nbsp; email: z.string().email('Email inválido'),

&nbsp; age: z.number().min(18, 'Mayor de edad'),

&nbsp; preferences: z.object({

&nbsp;   theme: z.enum(\['light', 'dark']).default('light'),

&nbsp;   notifications: z.boolean().default(true),

&nbsp; }),

});



export type User = z.infer<typeof userSchema>;

```



\## TIPOS TYPESCRIPT



```tsx

// Utility types

export type Optional<T, K extends keyof T> = Omit<T, K> \& Partial<Pick<T, K>>;



// Component props

export interface BaseProps {

&nbsp; className?: string;

&nbsp; children?: React.ReactNode;

}



// API responses

export interface ApiResponse<T> {

&nbsp; data: T;

&nbsp; status: 'success' | 'error';

&nbsp; message?: string;

}

```



\## UTILIDADES



```tsx

// lib/utils.ts

import { clsx, type ClassValue } from 'clsx';

import { twMerge } from 'tailwind-merge';



export function cn(...inputs: ClassValue\[]) {

&nbsp; return twMerge(clsx(inputs));

}



export function debounce<T extends (...args: any\[]) => any>(

&nbsp; func: T,

&nbsp; delay: number

): (...args: Parameters<T>) => void {

&nbsp; let timeoutId: NodeJS.Timeout;

&nbsp; return (...args: Parameters<T>) => {

&nbsp;   clearTimeout(timeoutId);

&nbsp;   timeoutId = setTimeout(() => func(...args), delay);

&nbsp; };

}

```



\## REGLAS DE ORO



1\. \*\*CSS NATIVO OBLIGATORIO\*\*: Animaciones, hover, transiciones - TODO con CSS/Tailwind

2\. \*\*React Completo\*\*: Usa hooks, context, patterns sin restricciones dogmáticas

3\. \*\*Tailwind Sin Límites\*\*: Clases dinámicas, variantes, plugins - todo permitido

4\. \*\*TypeScript Estricto\*\*: Tipado fuerte, evita `any`, usa tipos avanzados

5\. \*\*Performance Critical\*\*: Core Web Vitals verdes, optimización de imágenes

6\. \*\*Accesibilidad Built-in\*\*: HTML semántico, ARIA, navegación teclado

7\. \*\*Server-Client Híbrido\*\*: Usa la estrategia correcta para cada caso

8\. \*\*Componentes Composables\*\*: Sistema de diseño escalable



\## COMANDOS ÚTILES



```json

{

&nbsp; "scripts": {

&nbsp;   "dev": "next dev --turbo",

&nbsp;   "build": "next build",

&nbsp;   "lint": "next lint --fix",

&nbsp;   "type-check": "tsc --noEmit",

&nbsp;   "format": "prettier --write . --cache"

&nbsp; }

}

```



\*\*FUNDAMENTAL\*\*: JAMÁS uses JavaScript para estilos. CSS y Tailwind son suficientes y más eficientes para todo aspecto visual.

