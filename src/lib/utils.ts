import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColorClass = (color: string) => {
  const colors = {
    primary: 'text-purple-600',
    secondary: 'text-blue-600',
    accent: 'text-pink-600',
    neutral: 'text-gray-600',
  } as const;
  return colors[color as keyof typeof colors] || 'text-gray-500';
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};