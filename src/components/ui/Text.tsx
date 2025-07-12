/**
 * 基本的なテキストコンポーネント
 * 統一されたテキストスタイルを提供し、アクセシビリティを保証
 */

import { ReactNode } from 'react';
import { useTextColors } from '../../hooks/useTextColors';
import { type TextColorKey } from '../../styles/textColors';

interface TextProps {
  children: ReactNode;
  variant?: TextColorKey;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Text = ({ 
  children, 
  variant = 'secondary', 
  size = 'base',
  weight = 'normal',
  className = '',
  as: Component = 'span'
}: TextProps) => {
  const { getTextColor } = useTextColors();
  
  const classes = [
    getTextColor(variant),
    sizeClasses[size],
    weightClasses[weight],
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};

// 特殊化されたテキストコンポーネント
export const Heading = (props: Omit<TextProps, 'variant' | 'weight'> & { 
  variant?: 'primary' | 'secondary';
  weight?: 'medium' | 'semibold' | 'bold';
}) => (
  <Text 
    {...props} 
    variant={props.variant || 'primary'} 
    weight={props.weight || 'semibold'}
  />
);

export const Caption = (props: Omit<TextProps, 'variant' | 'size'>) => (
  <Text 
    {...props} 
    variant="muted" 
    size="sm"
  />
);

export const ErrorText = (props: Omit<TextProps, 'variant'>) => (
  <Text 
    {...props} 
    variant="error"
  />
);

export const SuccessText = (props: Omit<TextProps, 'variant'>) => (
  <Text 
    {...props} 
    variant="success"
  />
);

export const LoadingText = (props: Omit<TextProps, 'variant'>) => (
  <Text 
    {...props} 
    variant="muted"
  />
);
