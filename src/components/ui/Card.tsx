/**
 * 統一されたカードコンポーネント
 * 一貫性のあるカードスタイルを提供
 */

import { ReactNode } from 'react';
import { componentStyles } from '../../constants/uiConstants';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const variantClasses = {
  default: 'bg-white rounded-xl shadow-lg',
  elevated: 'bg-white rounded-xl shadow-xl',
  outlined: 'bg-white rounded-xl border border-gray-200 shadow-sm',
};

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'lg'
}: CardProps) => {
  const classes = [
    variantClasses[variant],
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`border-b border-gray-200 pb-4 mb-6 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => (
  <div className={className}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => (
  <div className={`border-t border-gray-200 pt-4 mt-6 ${className}`}>
    {children}
  </div>
);
