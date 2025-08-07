import { cn } from '@/lib/utils';
import { BaseProps } from '@/types';

interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-brand-magenta text-white hover:bg-brand-magenta-dark focus:ring-brand-magenta shadow-lg hover:shadow-xl': variant === 'primary',
          'bg-brand-magenta-light text-white hover:bg-brand-magenta focus:ring-brand-magenta-dark shadow-lg hover:shadow-xl': variant === 'secondary',
          'border-2 border-brand-magenta text-brand-magenta hover:bg-brand-magenta hover:text-white focus:ring-brand-magenta': variant === 'outline',
          'text-brand-magenta hover:text-brand-magenta-dark hover:bg-brand-magenta/10 focus:ring-brand-magenta': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
    >
      {children}
    </button>
  );
}
