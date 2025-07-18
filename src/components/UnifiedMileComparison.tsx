'use client';

import { useState } from 'react';
import { SearchResult } from '../types';
import { 
  Award, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Info,
  Plane,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UnifiedMileComparisonProps {
  result: SearchResult;
  onSelectOption?: (option: any) => void;
}

interface MileOption {
  id: string;
  airline: string;
  requiredMiles: number;
  cashPrice?: number;
  efficiency: number; // マイル効率性（％）
  availability: 'high' | 'medium' | 'low';
  season: 'regular' | 'peak' | 'off';
  valuePerMile: number; // 1マイルあたりの価値（円）
  savings: number; // 現金と比較した節約額
  isRecommended: boolean;
}

export default function UnifiedMileComparison({ result, onSelectOption }: UnifiedMileComparisonProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // マイルオプションを生成
  const generateMileOptions = (): MileOption[] => {
    const options: MileOption[] = [];
    
    result.airlines?.forEach((airlineInfo, index) => {
      const season = 'season' in result && typeof result.season === 'string' ? result.season : 'regular';
      const miles = airlineInfo.miles[season as keyof typeof airlineInfo.miles] || airlineInfo.miles.regular;
      const cashPrice = airlineInfo.cashPrice || 25000;
      const mileValue = miles > 0 ? cashPrice / miles : 0;
      const savings = cashPrice - (miles * 1.5); // 1マイル=1.5円として計算
      const efficiency = miles > 0 ? Math.round((savings / cashPrice) * 100) : 0;
      
      options.push({
        id: `${airlineInfo.airline}-${index}`,
        airline: airlineInfo.airline,
        requiredMiles: miles,
        cashPrice,
        efficiency: Math.max(0, efficiency),
        availability: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        season: season as 'regular' | 'peak' | 'off',
        valuePerMile: mileValue,
        savings: Math.max(0, savings),
        isRecommended: index === 0 // 最初のオプションを推奨とする
      });
    });

    return options.sort((a, b) => b.efficiency - a.efficiency);
  };

  const mileOptions = generateMileOptions();
  const bestOption = mileOptions.find(option => option.isRecommended);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'high': return '空席多';
      case 'medium': return '空席普通';
      case 'low': return '空席少';
      default: return '不明';
    }
  };

  const getAirlineColor = (airline: string) => {
    switch (airline) {
      case 'ANA': return 'border-blue-300 bg-blue-50';
      case 'JAL': return 'border-red-300 bg-red-50';
      case 'SOLASEED': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const formatMiles = (miles: number) => {
    return (miles || 0).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `¥${(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-800">マイル比較・最適化</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <Calculator className="w-4 h-4" />
          {showDetails ? '簡易表示' : '詳細表示'}
        </button>
      </div>

      {/* 路線情報 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{result.route?.departure || 'N/A'}</div>
              <div className="text-sm text-gray-600">出発</div>
            </div>
            <Plane className="w-5 h-5 text-gray-400 transform rotate-90" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{result.route?.arrival || 'N/A'}</div>
              <div className="text-sm text-gray-600">到着</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{'distance' in (result.route || {}) ? (result.route as any).distance : 'N/A'}km</div>
            <div className="text-sm text-gray-600">距離</div>
          </div>
        </div>
      </div>

      {/* 推奨オプションのハイライト */}
      {bestOption && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-green-800">最推奨オプション</h4>
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              BEST
            </span>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">航空会社</div>
              <div className="text-xl font-bold text-green-600">{bestOption.airline}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">必要マイル</div>
              <div className="text-xl font-bold text-green-600">
                {formatMiles(bestOption.requiredMiles)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">効率性</div>
              <div className="text-xl font-bold text-green-600">{bestOption.efficiency}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">節約額</div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(bestOption.savings)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 比較表 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">
                航空会社
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                必要マイル
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                現金価格
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                効率性
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                空席状況
              </th>
              {showDetails && (
                <>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                    マイル価値
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                    節約額
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {mileOptions.map((option, index) => (
              <tr 
                key={option.id}
                className={`cursor-pointer transition-colors ${
                  selectedOption === option.id 
                    ? 'bg-blue-50 border-blue-300' 
                    : option.isRecommended 
                      ? 'bg-green-50' 
                      : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedOption(option.id);
                  onSelectOption?.(option);
                }}
              >
                <td className="border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.airline}</span>
                    {option.isRecommended && (
                      <Star className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center font-bold">
                  {formatMiles(option.requiredMiles)}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center">
                  {option.cashPrice ? formatCurrency(option.cashPrice) : '-'}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center">
                  <div className={`inline-flex items-center gap-1 ${
                    option.efficiency >= 50 ? 'text-green-600' : 
                    option.efficiency >= 25 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {option.efficiency >= 50 ? 
                      <TrendingUp className="w-4 h-4" /> : 
                      <TrendingDown className="w-4 h-4" />
                    }
                    {option.efficiency}%
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(option.availability)}`}>
                    {getAvailabilityText(option.availability)}
                  </span>
                </td>
                {showDetails && (
                  <>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      ¥{option.valuePerMile.toFixed(2)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-green-600 font-medium">
                      {formatCurrency(option.savings)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* シーズン情報 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">シーズン情報</h4>
            <p className="text-sm text-blue-700">
              現在のシーズン: <strong>
                {(('season' in result && typeof result.season === 'string') ? result.season : 'regular') === 'regular' ? 'レギュラーシーズン' : 
                 (('season' in result && typeof result.season === 'string') ? result.season : 'regular') === 'peak' ? 'ピークシーズン' : 'オフシーズン'}
              </strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              上記のマイル数は{('date' in result && typeof result.date === 'string') ? result.date : '指定日'}の搭乗日におけるシーズン判定に基づいています。
            </p>
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">ご利用前の確認事項</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 実際の予約時は各航空会社の公式サイトで最新情報をご確認ください</li>
              <li>• マイル必要数は搭乗日により変動する場合があります</li>
              <li>• 空席状況は実際の予約時とは異なる場合があります</li>
              <li>• 効率性の計算は1マイル=1.5円を基準としています</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
