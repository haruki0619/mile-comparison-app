// マイル価値結果の表示コンポーネント
import React from 'react';
import { Card } from '../ui/Card';
import { MileValueResult } from '../utils/mileValueCalculations';

interface MileValueDisplayProps {
  results: MileValueResult[];
  isCalculating: boolean;
}

export const MileValueDisplay: React.FC<MileValueDisplayProps> = ({
  results,
  isCalculating
}) => {
  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-orange-600 bg-orange-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  const getRatingLabel = (rating: string): string => {
    switch (rating) {
      case 'excellent': return '🌟 優秀';
      case 'good': return '👍 良好';
      case 'fair': return '⚖️ 普通';
      case 'poor': return '👎 低い';
      default: return '❌ 悪い';
    }
  };

  if (isCalculating) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">計算中...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        価格を入力して「計算」ボタンをクリックしてください
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={result.program} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {result.program}
              {index === 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🏆 ベスト
                </span>
              )}
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(result.rating)}`}>
              {getRatingLabel(result.rating)}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-500">必要マイル</p>
              <p className="text-lg font-bold text-blue-600">
                {result.requiredMiles.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">1マイル価値</p>
              <p className="text-lg font-bold text-green-600">
                {result.valuePerMile.toFixed(2)}円
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">燃油サーチャージ</p>
              <p className="text-lg font-semibold">
                ¥{result.fuelSurcharge.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">諸税</p>
              <p className="text-lg font-semibold">
                ¥{result.taxes.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-gray-100 rounded">
              ストップオーバー: {result.features.stopover}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded">
              オープンジョー: {result.features.openJaw ? '可能' : '不可'}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded">
              変更手数料: ¥{result.features.changesFee.toLocaleString()}
            </span>
            {result.isPartnerBooking && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                パートナー便
              </span>
            )}
          </div>

          {result.specialNote && (
            <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-700">{result.specialNote}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
