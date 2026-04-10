import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`p-6 rounded-2xl border transition-all ${className}`}>
      {children}
    </div>
  );
}