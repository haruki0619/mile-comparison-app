/**
 * 統一されたボタンコンポーネント
 * 一貫性のあるボタンスタイルとアクセシビリティを提供
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { borderRadius, spacing } from '../../constants/uiConstants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition-colors',
  ghost: 'text-blue-600 hover:bg-blue-50 font-semibold transition-colors',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const classes = [
    variantClasses[variant],
    sizeClasses[size],
    borderRadius.md,
    fullWidth ? 'w-full' : '',
    isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          読み込み中...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
