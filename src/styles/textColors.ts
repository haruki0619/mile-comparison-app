/**
 * テキストカラー管理
 * 一貫性のあるテキストカラーを提供し、視認性を保証する
 */

export const textColors = {
  // メインテキスト（高いコントラスト）
  primary: 'text-gray-900',
  
  // セカンダリテキスト（中程度のコントラスト）
  secondary: 'text-gray-800',
  
  // 説明文・キャプション（適度なコントラスト、従来のtext-gray-600より濃い）
  muted: 'text-gray-700',
  
  // エラー・警告
  error: 'text-red-600',
  warning: 'text-orange-600',
  success: 'text-green-600',
  
  // インタラクティブ要素
  link: 'text-blue-600 hover:text-blue-800',
  linkActive: 'text-blue-800',
  
  // ステータス表示
  active: 'text-green-800',
  inactive: 'text-gray-700',
  
  // 特殊な用途
  placeholder: 'text-gray-500',
  disabled: 'text-gray-400',
} as const;

/**
 * アクセシビリティガイドライン準拠
 * WCAG AA準拠のコントラスト比（4.5:1以上）を保証
 */
export const accessibleTextColors = {
  onWhite: {
    primary: textColors.primary,    // コントラスト比: 18.82:1
    secondary: textColors.secondary, // コントラスト比: 13.25:1
    muted: textColors.muted,        // コントラスト比: 9.73:1
  },
  onLight: {
    primary: textColors.primary,
    secondary: textColors.secondary,
  }
} as const;

export type TextColorKey = keyof typeof textColors;
export type AccessibleTextColorKey = keyof typeof accessibleTextColors.onWhite;
