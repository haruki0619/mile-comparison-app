/**
 * UI定数管理
 * アプリケーション全体で使用される定数を一元管理
 */

import { textColors } from '../styles/textColors';

// スペーシング定数
export const spacing = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  xxl: 'p-12',
} as const;

// ボーダー半径
export const borderRadius = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

// シャドウ
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const;

// アニメーション
export const animations = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const;

// コンポーネント用プリセット
export const componentStyles = {
  card: `bg-white ${borderRadius.xl} ${shadows.lg} ${spacing.lg}`,
  button: {
    primary: `bg-blue-600 hover:bg-blue-700 ${textColors.primary} font-semibold ${spacing.md} ${borderRadius.md}`,
    secondary: `bg-gray-200 hover:bg-gray-300 ${textColors.secondary} font-semibold ${spacing.md} ${borderRadius.md}`,
  },
  input: `border border-gray-300 ${borderRadius.md} ${spacing.sm} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`,
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
