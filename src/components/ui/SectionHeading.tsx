import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color?: 'primary' | 'secondary';
  className?: string;
}

export const SectionHeading = ({ children, color = 'primary', className = '' }: Props) => {
  const colorClass = color === 'primary' ? 'text-brand-600' : 'text-brand-800';
  return (
    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${colorClass} ${className}`}>
      {children}
    </h2>
  );
};