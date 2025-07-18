/**
 * マイル価値比較レポートコンポーネント
 * 複数の航空会社のマイル価値を比較し、最適な選択肢を提案（2025年7月版・航空会社別基準価値対応）
 */

import React from 'react';
import { SearchResult, AirlineMileInfo } from '../types';
import { Award, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { calculateSpecificMileValue, hasMileProgram, getBaselineMileValue } from '../utils/airlineMileValues';

interface MileValueComparisonProps {
  result: SearchResult;
}

interface MileAnalysis {
  airline: string;
  airlineName: string; // 表示用の航空会社名から実際の名前を抽出
  cashPrice: number;
  milesRequired: number;
  fuelSurcharge?: number;
  totalCost: number; // 燃油サーチャージ込みの総費用
  mileValue: number;
  baselineMileValue: number; // 航空会社固有の基準価値
  hasMileProgram: boolean;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  recommendation: 'cash' | 'miles' | 'neutral' | 'none';
  savings: number;
  interpretation: string;
  comparisonWithBaseline: string;
}

export default function MileValueComparison({ result }: MileValueComparisonProps) {
  // 早期リターン：航空会社データがない場合
  if (!result || !result.airlines || result.airlines.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-700">マイル価値分析</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          比較可能な航空会社データがありません。検索を実行してください。
        </p>
      </div>
    );
  }

  // 表示用航空会社名から実際の航空会社名を抽出
  const extractAirlineName = (displayName: string): string => {
    // "ANA NH123 (08:00発)" -> "ANA"
    const match = displayName.match(/^([^0-9\s]+)/);
    return match?.[1]?.trim() || displayName;
  };

  const calculateMileValue = (cashPrice: number, miles: number): number => {
    return miles > 0 ? Math.round((cashPrice / miles) * 100) / 100 : 0;
  };

  const getEfficiency = (mileValue: number, baselineValue: number): 'excellent' | 'good' | 'fair' | 'poor' | 'none' => {
    if (baselineValue === 0) return 'none';
    const ratio = mileValue / baselineValue;
    if (ratio >= 1.5) return 'excellent';
    if (ratio >= 1.2) return 'good';
    if (ratio >= 0.8) return 'fair';
    return 'poor';
  };

  const getRecommendation = (efficiency: string): 'cash' | 'miles' | 'neutral' | 'none' => {
    switch (efficiency) {
      case 'excellent': 
      case 'good': 
        return 'miles';
      case 'poor': 
        return 'cash';
      case 'none': 
        return 'none';
      default: 
        return 'neutral';
    }
  };

  const calculateSavings = (mileValue: number, baselineValue: number, miles: number): number => {
    if (baselineValue === 0 || miles === 0) return 0;
    const bonus = Math.max(0, mileValue - baselineValue);
    return Math.round(bonus * miles);
  };

  const analysis: MileAnalysis[] = result.airlines.map(airline => {
    const airlineName = extractAirlineName(airline.airline as string);
    const cashPrice = airline.cashPrice || 0;
    const milesRequired = airline.miles.regular;
    const fuelSurcharge = airline.fuelSurcharge || 0;
    const totalCost = cashPrice + fuelSurcharge; // 燃油サーチャージ込み
    
    // マイル制度の有無をチェック
    const hasValidMileProgram = hasMileProgram(airlineName);
    const baselineMileValue = getBaselineMileValue(airlineName);
    
    let mileValue = 0;
    let interpretation = 'マイル制度なし';
    let comparisonWithBaseline = 'N/A';
    
    if (hasValidMileProgram && milesRequired > 0) {
      mileValue = calculateMileValue(totalCost, milesRequired); // 総費用で計算
      const valueAnalysis = calculateSpecificMileValue(airlineName, cashPrice, milesRequired, fuelSurcharge);
      interpretation = valueAnalysis.interpretation;
      comparisonWithBaseline = valueAnalysis.comparisonWithBaseline;
    }
    
    const efficiency = getEfficiency(mileValue, baselineMileValue);
    const recommendation = getRecommendation(efficiency);
    const savings = calculateSavings(mileValue, baselineMileValue, milesRequired);

    return {
      airline: airline.airline as string,
      airlineName,
      cashPrice,
      milesRequired,
      fuelSurcharge,
      totalCost,
      mileValue,
      baselineMileValue,
      hasMileProgram: hasValidMileProgram,
      efficiency,
      recommendation,
      savings,
      interpretation,
      comparisonWithBaseline
    };
  });

  const bestMileOption = analysis
    .filter(item => item.hasMileProgram && item.milesRequired > 0)
    .reduce((best, current) => 
      current.mileValue > best.mileValue ? current : best, 
      { mileValue: 0, savings: 0, airline: '', interpretation: '', hasMileProgram: false } as MileAnalysis
    );

  const bestCashOption = analysis.length > 0 
    ? analysis.reduce((best, current) => 
        current.cashPrice < best.cashPrice ? current : best
      )
    : null;

  const getEfficiencyIcon = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'fair': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'poor': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'none': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEfficiencyColor = (efficiency: string): string => {
    switch (efficiency) {
      case 'excellent': return 'text-green-700 bg-green-100';
      case 'good': return 'text-blue-700 bg-blue-100';
      case 'fair': return 'text-yellow-700 bg-yellow-100';
      case 'poor': return 'text-red-700 bg-red-100';
      case 'none': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">マイル価値分析</h3>
      </div>

      {/* 最適解の提案 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">💡 推奨</h4>
        {bestMileOption.hasMileProgram && bestMileOption.mileValue >= bestMileOption.baselineMileValue * 1.2 ? (
          <div className="text-sm text-gray-700">
            <p>
              <span className="font-medium text-green-700">{bestMileOption.airlineName}</span>のマイル特典航空券がお得です！
            </p>
            <p className="mt-1 text-xs text-gray-600">
              このルートでのマイル価値: <span className="font-medium text-green-600">{bestMileOption.mileValue.toFixed(2)}円/マイル</span>
            </p>
            <p className="text-xs text-gray-500">
              {bestMileOption.airlineName}の一般的な価値（{bestMileOption.baselineMileValue.toFixed(1)}円/マイル）を上回っています
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {bestMileOption.interpretation} - 約{bestMileOption.savings.toLocaleString()}円相当のボーナス価値
            </p>
          </div>
        ) : bestCashOption ? (
          <div className="text-sm text-gray-700">
            <p>
              <span className="font-medium text-blue-700">{bestCashOption.airlineName}</span>の現金購入がお得です。
              （¥{bestCashOption.cashPrice.toLocaleString()}）
            </p>
            <p className="mt-1 text-xs text-gray-600">
              マイル特典の価値が基準値を下回るため、現金購入を推奨します。
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            <p className="font-medium text-gray-600">
              比較データが不足しています。
            </p>
            <p className="mt-1 text-xs text-gray-500">
              航空会社データを確認してください。
            </p>
          </div>
        )}
      </div>

      {/* 詳細分析表 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-700">便・時間</th>
              <th className="text-right py-2 font-medium text-gray-700">現金価格</th>
              <th className="text-right py-2 font-medium text-gray-700">燃油サーチャージ</th>
              <th className="text-right py-2 font-medium text-gray-700">総費用</th>
              <th className="text-right py-2 font-medium text-gray-700">必要マイル</th>
              <th className="text-right py-2 font-medium text-gray-700">マイル価値</th>
              <th className="text-center py-2 font-medium text-gray-700">効率</th>
              <th className="text-center py-2 font-medium text-gray-700">推奨</th>
            </tr>
          </thead>
          <tbody>
            {analysis.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">
                  <div>
                    <div className="font-medium">{item.airline}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.airlineName}
                      {!item.hasMileProgram && (
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                          マイル制度なし
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right text-gray-900">¥{item.cashPrice.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-600">
                  {item.fuelSurcharge ? `¥${item.fuelSurcharge.toLocaleString()}` : '—'}
                </td>
                <td className="py-3 text-right font-semibold text-gray-900">¥{item.totalCost.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-900">
                  {item.hasMileProgram ? item.milesRequired.toLocaleString() : '—'}
                </td>
                <td className="py-3 text-right font-semibold text-gray-900">
                  {item.hasMileProgram ? (
                    <div>
                      <div className="text-green-600 font-bold">🟢 {item.mileValue.toFixed(2)}円/マイル</div>
                      <div className="text-xs text-gray-500">
                        標準価値: {item.baselineMileValue.toFixed(1)}円
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getEfficiencyIcon(item.efficiency)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyColor(item.efficiency)}`}>
                      {item.efficiency === 'excellent' && '優秀'}
                      {item.efficiency === 'good' && '良好'}
                      {item.efficiency === 'fair' && '普通'}
                      {item.efficiency === 'poor' && '要注意'}
                      {item.efficiency === 'none' && '対象外'}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.recommendation === 'miles' ? 'text-green-700 bg-green-100' :
                    item.recommendation === 'cash' ? 'text-red-700 bg-red-100' :
                    item.recommendation === 'none' ? 'text-gray-700 bg-gray-100' :
                    'text-blue-700 bg-blue-100'
                  }`}>
                    {item.recommendation === 'miles' && 'マイル'}
                    {item.recommendation === 'cash' && '現金'}
                    {item.recommendation === 'neutral' && 'どちらでも'}
                    {item.recommendation === 'none' && '現金のみ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 注意事項 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          <strong>マイル価値計算について:</strong> 
          各航空会社のマイルプログラムには固有の基準価値があります（ANA: 2.0円/マイル、JAL: 2.2円/マイル等）。
          表示される価値は、この特定ルートでの実際の価値であり、基準価値との比較で効率性を判定しています。
          燃油サーチャージは変動するため、実際の予約時に最新の料金をご確認ください。
        </p>
      </div>
    </div>
  );
}
