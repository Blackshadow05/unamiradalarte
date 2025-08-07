'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaseProps } from '@/types';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'xl-plus' | 'full';

interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  size = 'lg' 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    'xl-plus': 'max-w-7xl min-h-[85vh]',
    full: 'max-w-7xl',
  };

  // Typography tweaks for larger PC view
  const headerTitleClass = size === 'xl-plus' 
    ? 'text-5xl md:text-6xl font-bold text-gray-900'
    : 'text-3xl md:text-4xl font-bold text-gray-900';

  const contentTextClass = size === 'xl-plus' 
    ? 'text-xl md:text-2xl leading-relaxed'
    : 'text-base md:text-lg leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full bg-white rounded-2xl shadow-2xl transform transition-all animate-slide-up',
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className={headerTitleClass}>{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className={cn(!title && 'p-6', contentTextClass)}>
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg transition-colors shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}