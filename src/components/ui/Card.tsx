import { cn } from '@/lib/utils';
import { BaseProps } from '@/types';

interface CardProps extends BaseProps {
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, className, hover = true, glass = false }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white shadow-sm border',
        {
          'hover-lift': hover,
          'glass-effect': glass,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: BaseProps) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: BaseProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: BaseProps) {
  return (
    <div className={cn('p-6 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}