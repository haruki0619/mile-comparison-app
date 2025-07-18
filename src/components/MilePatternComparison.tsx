'use client';

import { useState } from 'react';
import { SearchResult } from '../types';
import { 
  Award, 
  TrendingDown, 
  TrendingUp, 
  Info, 
  Star,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import BookingGuide from './BookingGuide';

interface MilePatternOption {
  id: string;
  name: string;
  description: string;
  totalMiles: number;
  cashAmount: number;
  benefits: string[];
  limitations: string[];
  efficiency: 'best' | 'good' | 'standard';
  type: 'alliance' | 'direct' | 'partner';
}

interface MilePatternComparisonProps {
  result: SearchResult;
  onSelectPattern?: (pattern: MilePatternOption) => void;
}

export default function MilePatternComparison({ result, onSelectPattern }: MilePatternComparisonProps) {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  // JALの例に基づいたパターン生成（実際のAPIからデータを取得する場合はここを修正）
  const generatePatterns = (): MilePatternOption[] => {
    const baseRoute = `${result.route?.departure || 'N/A'} → ${result.route?.arrival || 'N/A'}`;
    
    return [
      {
        id: 'alliance',
        name: 'ワンワールド特典航空券',
        description: '他社便との組み合わせ',
        totalMiles: 40000,
        cashAmount: 8200,
        benefits: [
          '必要マイル数が最適',
          '諸費用が抑えられる',
          '国内線接続も含まれる'
        ],
        limitations: [
          'ワンワールド加盟航空会社のみ',
          '空席に制限あり'
        ],
        efficiency: 'best',
        type: 'alliance'
      },
      {
        id: 'partner',
        name: 'JMB提携特典航空券',
        description: '提携航空会社利用',
        totalMiles: 45000,
        cashAmount: 7410,
        benefits: [
          '諸費用が最安',
          '予約しやすい',
          '柔軟な変更可能'
        ],
        limitations: [
          'マイル数がやや多い',
          '提携航空会社に限定'
        ],
        efficiency: 'good',
        type: 'partner'
      },
      {
        id: 'direct',
        name: 'JAL特典航空券',
        description: 'JAL直営便',
        totalMiles: 25000,
        cashAmount: 44280,
        benefits: [
          '必要マイル数が最少',
          'JAL便の安心感',
          '上級会員特典適用'
        ],
        limitations: [
          '諸費用が高額',
          '米国内線は別手配',
          '座席クラスに制限'
        ],
        efficiency: 'standard',
        type: 'direct'
      }
    ];
  };

  const patterns = generatePatterns();

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'best': return 'border-green-300 bg-green-50';
      case 'good': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getEfficiencyIcon = (efficiency: string) => {
    switch (efficiency) {
      case 'best': return <Star className="w-5 h-5 text-green-600" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatMiles = (miles: number) => {
    return new Intl.NumberFormat('ja-JP').format(miles);
  };

  const calculateEfficiencyScore = (pattern: MilePatternOption) => {
    // マイル価値を1マイル=1.5円として計算
    const mileValue = pattern.totalMiles * 1.5;
    const totalCost = mileValue + pattern.cashAmount;
    return Math.round((1 / totalCost) * 10000000); // 効率スコア
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold text-gray-800">特典航空券パターン比較</h3>
        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
          最適化提案
        </span>
      </div>

      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <div
            key={pattern.id}
            className={`border-2 rounded-xl p-5 transition-all cursor-pointer hover:shadow-md ${
              selectedPattern === pattern.id
                ? 'border-blue-500 bg-blue-50'
                : getEfficiencyColor(pattern.efficiency)
            }`}
            onClick={() => {
              setSelectedPattern(pattern.id);
              onSelectPattern?.(pattern);
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getEfficiencyIcon(pattern.efficiency)}
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{pattern.name}</h4>
                  <p className="text-gray-600 text-sm">{pattern.description}</p>
                </div>
                {pattern.efficiency === 'best' && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    最推奨
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">効率スコア</div>
                <div className="font-bold text-lg">
                  {calculateEfficiencyScore(pattern)}pt
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">必要マイル</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatMiles(pattern.totalMiles)} マイル
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">諸費用</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(pattern.cashAmount)}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  メリット
                </h5>
                <ul className="space-y-1">
                  {pattern.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-orange-700 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  注意点
                </h5>
                <ul className="space-y-1">
                  {pattern.limitations.map((limitation, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedPattern === pattern.id && (
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{pattern.name}</strong>を選択しました。
                    以下の手順で予約を進めることができます。
                  </p>
                </div>
                
                <BookingGuide 
                  airline="JAL" 
                  bookingType={pattern.type}
                  onStepComplete={(stepId) => {
                    console.log('Step completed:', stepId);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>💡 プロのアドバイス:</strong> 
              ワンワールド特典航空券は知名度が低いですが、実は最もお得な選択肢です。
              マイル数と諸費用のバランスが最適で、国内線接続も含まれているため総合的にお得です。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
