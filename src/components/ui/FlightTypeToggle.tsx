// 国内線・国際線切替UI（アニメーション付き）
// ファクトチェック: 設計書のUI要件に基づく実装

'use client';

import { useState } from 'react';
import { Plane, Globe } from 'lucide-react';

export type FlightType = 'domestic' | 'international';

interface FlightTypeToggleProps {
  currentType: FlightType;
  onTypeChange: (type: FlightType) => void;
  className?: string;
}

export const FlightTypeToggle: React.FC<FlightTypeToggleProps> = ({
  currentType,
  onTypeChange,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (newType: FlightType) => {
    if (newType === currentType || isAnimating) return;
    
    setIsAnimating(true);
    onTypeChange(newType);
    
    // アニメーション完了後にフラグをリセット
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={`flight-type-toggle ${className}`}>
      {/* スライド背景 */}
      <div 
        className={`flight-type-toggle-background ${currentType}`}
      />
      
      {/* 国内線ボタン */}
      <button
        onClick={() => handleToggle('domestic')}
        className={`flight-type-button ${currentType === 'domestic' ? 'active' : 'inactive'}`}
        disabled={isAnimating}
      >
        <Plane className="w-5 h-5" />
        <span>国内線</span>
      </button>
      
      {/* 国際線ボタン */}
      <button
        onClick={() => handleToggle('international')}
        className={`flight-type-button ${currentType === 'international' ? 'active' : 'inactive'}`}
        disabled={isAnimating}
      >
        <Globe className="w-5 h-5" />
        <span>国際線</span>
      </button>
    </div>
  );
};
