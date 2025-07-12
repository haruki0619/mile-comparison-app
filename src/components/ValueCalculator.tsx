'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface PointValue {
  program: string;
  logo: string;
  pointsRequired: number;
  cashValue: number;
  valuePerPoint: number;
  savings: number;
  recommendation: 'points' | 'cash' | 'neutral';
}

interface ValueCalculatorProps {
  departure: string;
  arrival: string;
  cashPrice: number;
}

export default function ValueCalculator({ departure, arrival, cashPrice }: ValueCalculatorProps) {
  const [selectedClass, setSelectedClass] = useState<'economy' | 'premium' | 'business'>('economy');

  // 各プログラムのポイント価値を計算
  const calculatePointValues = (): PointValue[] => {
    const baseMultiplier = selectedClass === 'economy' ? 1 : selectedClass === 'premium' ? 1.5 : 2.5;
    
    return [
      {
        program: 'ANA マイレージクラブ',
        logo: '🛩️',
        pointsRequired: Math.round(12000 * baseMultiplier),
        cashValue: cashPrice,
        valuePerPoint: cashPrice / (12000 * baseMultiplier),
        savings: cashPrice - (12000 * baseMultiplier * 1.5), // 1.5円/マイルと仮定
        recommendation: cashPrice / (12000 * baseMultiplier) > 1.5 ? 'points' : 'cash'
      },
      {
        program: 'JAL マイレージバンク',
        logo: '🛫',
        pointsRequired: Math.round(12500 * baseMultiplier),
        cashValue: cashPrice,
        valuePerPoint: cashPrice / (12500 * baseMultiplier),
        savings: cashPrice - (12500 * baseMultiplier * 1.8), // 1.8円/マイルと仮定
        recommendation: cashPrice / (12500 * baseMultiplier) > 1.8 ? 'points' : 'cash'
      },
      {
        program: 'Chase Ultimate Rewards',
        logo: '💳',
        pointsRequired: Math.round(cashPrice * 0.8), // 1.25セント/ポイント
        cashValue: cashPrice,
        valuePerPoint: 1.25,
        savings: cashPrice - (cashPrice * 0.8 * 1.25),
        recommendation: 'neutral'
      },
      {
        program: 'Amex Membership Rewards',
        logo: '💎',
        pointsRequired: Math.round(cashPrice * 0.65), // 1.54セント/ポイント
        cashValue: cashPrice,
        valuePerPoint: 1.54,
        savings: cashPrice - (cashPrice * 0.65 * 1.54),
        recommendation: 'points'
      }
    ];
  };

  const pointValues = calculatePointValues();
  const bestValue = pointValues.reduce((best, current) => 
    current.valuePerPoint > best.valuePerPoint ? current : best
  );

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'points': return 'text-green-600 bg-green-50';
      case 'cash': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'points': return <TrendingUp className="w-4 h-4" />;
      case 'cash': return <TrendingDown className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'points': return 'ポイント利用がお得';
      case 'cash': return '現金購入がお得';
      default: return 'どちらでも同じ';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          ポイント価値計算機
        </h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedClass('economy')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedClass === 'economy' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            エコノミー
          </button>
          <button
            onClick={() => setSelectedClass('premium')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedClass === 'premium' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            プレミアム
          </button>
          <button
            onClick={() => setSelectedClass('business')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedClass === 'business' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            ビジネス
          </button>
        </div>
      </div>

      {departure && arrival && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            {departure} → {arrival} ({selectedClass === 'economy' ? 'エコノミー' : selectedClass === 'premium' ? 'プレミアムエコノミー' : 'ビジネス'}クラス)
          </h3>
          <div className="text-2xl font-bold text-blue-800">
            現金価格: ¥{cashPrice.toLocaleString()}
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {pointValues.map((value) => (
          <div key={value.program} className={`
            border-2 rounded-lg p-4 transition-all
            ${value.program === bestValue.program ? 'border-green-500 bg-green-50' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{value.logo}</span>
                <div>
                  <h4 className="font-semibold text-lg">{value.program}</h4>
                  {value.program === bestValue.program && (
                    <span className="text-sm text-green-600 font-medium">👑 最もお得</span>
                  )}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getRecommendationColor(value.recommendation)}`}>
                {getRecommendationIcon(value.recommendation)}
                {getRecommendationText(value.recommendation)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">必要ポイント/マイル</div>
                <div className="text-xl font-bold">{value.pointsRequired.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">1ポイント/マイルの価値</div>
                <div className="text-xl font-bold">¥{value.valuePerPoint.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">節約額</div>
                <div className={`text-xl font-bold ${value.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {value.savings > 0 ? '+' : ''}¥{Math.round(value.savings).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">節約率</div>
                <div className={`text-xl font-bold ${value.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {((value.savings / cashPrice) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>価値効率</span>
                <span>{((value.valuePerPoint / bestValue.valuePerPoint) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    value.program === bestValue.program ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(value.valuePerPoint / bestValue.valuePerPoint) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 注意事項 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-1">計算について</div>
            <ul className="list-disc list-inside space-y-1">
              <li>ポイント/マイルの価値は過去の平均値に基づく推定です</li>
              <li>実際の交換レートや空席状況により変動する場合があります</li>
              <li>税金やサーチャージは含まれていません</li>
              <li>国際線の場合、価値がさらに高くなる可能性があります</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
