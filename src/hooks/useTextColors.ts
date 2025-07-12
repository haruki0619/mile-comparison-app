/**
 * フック: テキストカラー管理
 * コンポーネントで統一されたテキストカラーを使用するためのフック
 */

import { textColors, type TextColorKey } from '../styles/textColors';

export const useTextColors = () => {
  const getTextColor = (colorKey: TextColorKey): string => {
    return textColors[colorKey];
  };

  const combineTextColors = (...colorKeys: TextColorKey[]): string => {
    return colorKeys.map(key => textColors[key]).join(' ');
  };

  return {
    colors: textColors,
    getTextColor,
    combineTextColors,
  };
};

/**
 * 使用例:
 * const { colors, getTextColor } = useTextColors();
 * <p className={getTextColor('muted')}>説明文</p>
 * <h1 className={getTextColor('primary')}>タイトル</h1>
 */
