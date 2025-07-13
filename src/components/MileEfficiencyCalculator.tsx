'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Award } from 'lucide-react';

interface MileEfficiencyCalculatorProps {
  onCalculationChange?: (result: EfficiencyResult) => void;
}

interface EfficiencyResult {
  milesCost: number;
  cashCost: number;
  mileValue: number;
  totalValue: number;
  recommendation: 'miles' | 'cash' | 'mixed';
  savings: number;
}

export default function MileEfficiencyCalculator({ onCalculationChange }: MileEfficiencyCalculatorProps) {
  const [milesRequired, setMilesRequired] = useState(40000);
  const [cashPrice, setCashPrice] = useState(120000);
  const [currentMiles, setCurrentMiles] = useState(50000);
  const [mileValue, setMileValue] = useState(1.5); // 1マイルの価値（円）

  const efficiency = useMemo((): EfficiencyResult => {
    const milesCost = milesRequired * mileValue;
    const savings = cashPrice - milesCost;
    
    let recommendation: 'miles' | 'cash' | 'mixed' = 'cash';
    if (savings > 0 && currentMiles >= milesRequired) {
      recommendation = 'miles';
    } else if (savings < -20000) {
      recommendation = 'cash';
    } else {
      recommendation = 'mixed';
    }

    const result: EfficiencyResult = {
      milesCost,
      cashCost: cashPrice,
      mileValue,
      totalValue: Math.max(milesCost, cashPrice),
      recommendation,
      savings: Math.abs(savings)
    };

    onCalculationChange?.(result);
    return result;
  }, [milesRequired, cashPrice, currentMiles, mileValue, onCalculationChange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatMiles = (miles: number) => {
    return new Intl.NumberFormat('ja-JP').format(miles);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'miles': return 'bg-green-50 border-green-200 text-green-800';
      case 'cash': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'miles': return 'マイル利用がお得！';
      case 'cash': return '現金購入がお得！';
      default: return '部分的マイル利用を検討';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">マイル効率計算機</h3>
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
          リアルタイム分析
        </span>
      </div>

      {/* 入力フィールド */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              必要マイル数
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={milesRequired}
                onChange={(e) => setMilesRequired(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="40000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              現金価格
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={cashPrice}
                onChange={(e) => setCashPrice(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="120000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              保有マイル数
            </label>
            <input
              type="number"
              value={currentMiles}
              onChange={(e) => setCurrentMiles(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1マイルの価値（円）
            </label>
            <input
              type="number"
              step="0.1"
              value={mileValue}
              onChange={(e) => setMileValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="1.5"
            />
          </div>
        </div>
      </div>

      {/* 計算結果 */}
      <div className="border-t pt-6">
        <div className={`p-4 rounded-lg border-2 mb-4 ${getRecommendationColor(efficiency.recommendation)}`}>
          <div className="flex items-center gap-2 mb-2">
            {efficiency.recommendation === 'miles' ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="font-bold text-lg">
              {getRecommendationText(efficiency.recommendation)}
            </span>
          </div>
          <p className="text-sm">
            {efficiency.recommendation === 'miles' 
              ? `マイル利用で ${formatCurrency(efficiency.savings)} お得になります`
              : `現金購入の方が ${formatCurrency(efficiency.savings)} お得です`
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-blue-700 font-medium mb-1">マイル利用時のコスト</div>
            <div className="text-xl font-bold text-blue-800">
              {formatCurrency(efficiency.milesCost)}
            </div>
            <div className="text-sm text-blue-600">
              ({formatMiles(milesRequired)} マイル × {mileValue}円)
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-green-700 font-medium mb-1">現金価格</div>
            <div className="text-xl font-bold text-green-800">
              {formatCurrency(efficiency.cashCost)}
            </div>
            <div className="text-sm text-green-600">
              航空券購入価格
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-purple-700 font-medium mb-1">差額</div>
            <div className="text-xl font-bold text-purple-800">
              {formatCurrency(efficiency.savings)}
            </div>
            <div className="text-sm text-purple-600">
              {efficiency.recommendation === 'miles' ? 'お得' : '損失'}
            </div>
          </div>
        </div>

        {/* マイル不足の場合の提案 */}
        {currentMiles < milesRequired && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2">
              マイル不足のお知らせ
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              {formatMiles(milesRequired - currentMiles)} マイル不足しています。
              以下の方法で補うことができます：
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-800">マイル購入</div>
                <div className="text-sm text-gray-600">
                  約 {formatCurrency((milesRequired - currentMiles) * 2.5)} 
                  （1マイル=2.5円）
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-800">部分マイル + 現金</div>
                <div className="text-sm text-gray-600">
                  {formatMiles(currentMiles)} マイル + 現金併用
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
