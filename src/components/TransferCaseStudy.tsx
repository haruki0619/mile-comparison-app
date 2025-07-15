'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// ケーススタディのデータ型
interface CaseStudy {
  id: string;
  title: string;
  description: string;
  goal: {
    route: string;
    class: string;
    passengers: number;
    totalMiles: number;
    airline: string;
  };
  resources: {
    [key: string]: number;
  };
  constraints: string[];
  solutions: Solution[];
}

interface Solution {
  name: string;
  steps: TransferStep[];
  totalCost: string;
  timeRequired: string;
  successRate: number;
  pros: string[];
  cons: string[];
  recommendation: 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended';
}

interface TransferStep {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: string;
  time: string;
  notes?: string;
}

// 実際のケーススタディデータ
const caseStudies: CaseStudy[] = [
  {
    id: 'nyc_business_2pax',
    title: '東京⇔ニューヨーク ビジネス2名',
    description: '年末年始の繁忙期にビジネスクラスでニューヨーク旅行を計画',
    goal: {
      route: '東京(NRT/HND) ⇔ ニューヨーク(JFK/LGA)',
      class: 'ビジネスクラス',
      passengers: 2,
      totalMiles: 190000,
      airline: 'ANA'
    },
    resources: {
      'Amex MR JP': 80000,
      'Marriott Bonvoy': 120000,
      '楽天ポイント': 40000,
      'JCB Oki Doki': 15000
    },
    constraints: [
      '3ヶ月以内に確保',
      '追加コストは50万円以内',
      '確実性を重視'
    ],
    solutions: [
      {
        name: 'Plan A: 直接転送メイン',
        steps: [
          {
            from: 'Amex MR JP',
            to: 'ANA',
            amount: 80000,
            result: 80000,
            rate: '1:1',
            time: '1-2週間'
          },
          {
            from: 'Marriott Bonvoy',
            to: 'ANA',
            amount: 120000,
            result: 50000,
            rate: '3:1+ボーナス',
            time: '2-7日',
            notes: '60,000pt→25,000M+5,000Mボーナス×2回'
          },
          {
            from: '楽天ポイント',
            to: 'ANA',
            amount: 40000,
            result: 20000,
            rate: '2:1',
            time: '翌月末'
          },
          {
            from: 'JCB Oki Doki',
            to: 'ANA',
            amount: 15000,
            result: 45000,
            rate: '1:3',
            time: '1-2週間'
          }
        ],
        totalCost: '¥15,000 (転送手数料)',
        timeRequired: '最大6週間',
        successRate: 90,
        pros: [
          '確実性が高い',
          '複数ルート並行可能',
          '追加コスト最小'
        ],
        cons: [
          '5,000マイル不足',
          '楽天P転送は翌月'
        ],
        recommendation: 'highly_recommended'
      },
      {
        name: 'Plan B: Virgin Atlantic経由',
        steps: [
          {
            from: 'Amex MR JP',
            to: 'Virgin Atlantic',
            amount: 170000,
            result: 170000,
            rate: '1:1',
            time: '即時',
            notes: '追加90,000MR必要'
          },
          {
            from: 'Virgin Atlantic',
            to: 'ANA',
            amount: 170000,
            result: 190000,
            rate: '特別レート',
            time: '電話発券',
            notes: 'Virgin→ANA特別転送'
          }
        ],
        totalCost: '¥200,000 (追加MR獲得)',
        timeRequired: '2-3週間',
        successRate: 75,
        pros: [
          '必要マイル数確保可能',
          '転送時間短縮'
        ],
        cons: [
          '電話発券必須',
          '空席確保困難',
          '高コスト'
        ],
        recommendation: 'consider'
      }
    ]
  },
  {
    id: 'seoul_economy_4pax',
    title: '東京⇔ソウル エコノミー4名',
    description: 'GW期間中の家族旅行で短距離国際線を効率活用',
    goal: {
      route: '東京(HND) ⇔ ソウル(ICN)',
      class: 'エコノミークラス',
      passengers: 4,
      totalMiles: 60000,
      airline: 'British Airways (Avios)'
    },
    resources: {
      'セゾン永久不滅': 50000,
      'Marriott Bonvoy': 90000,
      'Amex MR JP': 30000
    },
    constraints: [
      '1ヶ月以内',
      'コスト最優先',
      '手数料最小化'
    ],
    solutions: [
      {
        name: 'Plan A: セゾン+Marriott',
        steps: [
          {
            from: 'セゾン永久不滅',
            to: 'British Airways',
            amount: 50000,
            result: 62500,
            rate: '200:500',
            time: '3-5日',
            notes: '250回転送で62,500 Avios'
          },
          {
            from: 'Marriott Bonvoy',
            to: 'British Airways',
            amount: 60000,
            result: 25000,
            rate: '3:1+ボーナス',
            time: '2-3日'
          }
        ],
        totalCost: '¥0 (手数料無料)',
        timeRequired: '1週間',
        successRate: 95,
        pros: [
          '完全無料',
          '高速転送',
          '必要分確保'
        ],
        cons: [
          '27,500 Avios余剰',
          'セゾン残高不足'
        ],
        recommendation: 'highly_recommended'
      }
    ]
  },
  {
    id: 'domestic_annual',
    title: 'JAL国内線年間10回利用',
    description: '出張頻度の高いビジネスマンの年間マイル戦略',
    goal: {
      route: '東京⇔大阪・福岡・札幌等',
      class: 'エコノミークラス',
      passengers: 1,
      totalMiles: 120000,
      airline: 'JAL'
    },
    resources: {
      'dポイント': 60000,
      'Ponta': 30000,
      'JRE POINT': 18000
    },
    constraints: [
      '継続的な戦略',
      '月間上限管理',
      '効率最大化'
    ],
    solutions: [
      {
        name: 'Plan A: 月間継続転送',
        steps: [
          {
            from: 'dポイント',
            to: 'JAL',
            amount: 60000,
            result: 30000,
            rate: '2:1',
            time: '2-7日',
            notes: '月40,000M上限なので2ヶ月分割'
          },
          {
            from: 'Ponta',
            to: 'JAL',
            amount: 30000,
            result: 15000,
            rate: '2:1',
            time: '即時',
            notes: '月20,000M上限'
          },
          {
            from: 'JRE POINT',
            to: 'JAL',
            amount: 18000,
            result: 6000,
            rate: '3:1',
            time: '翌月15日',
            notes: '月6,000M上限'
          }
        ],
        totalCost: '¥0',
        timeRequired: '3ヶ月継続',
        successRate: 100,
        pros: [
          '完全無料',
          '確実性100%',
          'Ponta即時転送'
        ],
        cons: [
          '69,000マイル不足',
          '追加戦略必要'
        ],
        recommendation: 'recommended'
      }
    ]
  }
];

const TransferCaseStudy: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string>(caseStudies[0]?.id || '');
  const [selectedSolution, setSelectedSolution] = useState<number>(0);

  const currentCase = caseStudies.find(c => c.id === selectedCase) || caseStudies[0];
  const currentSolution = currentCase?.solutions[selectedSolution];

  if (!currentCase || !currentSolution) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center text-gray-500">
            ケーススタディデータの読み込みに失敗しました。
          </div>
        </Card>
      </div>
    );
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'highly_recommended': return 'bg-green-100 text-green-800 border-green-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'consider': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_recommended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationLabel = (rec: string) => {
    switch (rec) {
      case 'highly_recommended': return '強く推奨';
      case 'recommended': return '推奨';
      case 'consider': return '検討価値あり';
      case 'not_recommended': return '非推奨';
      default: return '不明';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          マイル転送戦略ケーススタディ
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ケース選択 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ケース選択
            </h3>
            {caseStudies.map((caseStudy) => (
              <button
                key={caseStudy.id}
                onClick={() => {
                  setSelectedCase(caseStudy.id);
                  setSelectedSolution(0);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedCase === caseStudy.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-2">
                  {caseStudy.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {caseStudy.description}
                </p>
              </button>
            ))}
          </div>

          {/* ケース詳細 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 目標設定 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                🎯 目標設定
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">路線:</span>
                  <div className="font-medium">{currentCase.goal.route}</div>
                </div>
                <div>
                  <span className="text-blue-700">座席クラス:</span>
                  <div className="font-medium">{currentCase.goal.class}</div>
                </div>
                <div>
                  <span className="text-blue-700">乗客数:</span>
                  <div className="font-medium">{currentCase.goal.passengers}名</div>
                </div>
                <div>
                  <span className="text-blue-700">必要マイル:</span>
                  <div className="font-bold text-blue-900">
                    {currentCase.goal.totalMiles.toLocaleString()}マイル
                  </div>
                </div>
              </div>
            </div>

            {/* 現在保有リソース */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                💰 保有リソース
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentCase.resources).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-green-700">{key}:</span>
                    <span className="font-medium">{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 制約条件 */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">
                ⚠️ 制約条件
              </h3>
              <ul className="space-y-1">
                {currentCase.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-orange-800">
                    • {constraint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* ソリューション */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            💡 転送戦略ソリューション
          </h3>
          {currentCase.solutions.length > 1 && (
            <div className="flex space-x-2">
              {currentCase.solutions.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedSolution(index)}
                  className={`px-3 py-1 text-sm ${
                    selectedSolution === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {index === 0 ? 'Plan A' : index === 1 ? 'Plan B' : `Plan ${String.fromCharCode(65 + index)}`}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ソリューション概要 */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                {currentSolution.name}
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">総コスト:</span>
                  <span className="font-medium">{currentSolution.totalCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">所要時間:</span>
                  <span className="font-medium">{currentSolution.timeRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">成功率:</span>
                  <span className="font-medium">{currentSolution.successRate}%</span>
                </div>
              </div>

              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                  getRecommendationColor(currentSolution.recommendation)
                }`}>
                  {getRecommendationLabel(currentSolution.recommendation)}
                </span>
              </div>
            </div>

            {/* メリット・デメリット */}
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-green-900 mb-2">✅ メリット</h5>
                <ul className="space-y-1">
                  {currentSolution.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-green-800">
                      • {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-red-900 mb-2">❌ デメリット</h5>
                <ul className="space-y-1">
                  {currentSolution.cons.map((con, index) => (
                    <li key={index} className="text-sm text-red-800">
                      • {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 転送ステップ */}
          <div className="lg:col-span-2">
            <h5 className="font-medium text-gray-900 mb-4">転送フロー</h5>
            <div className="space-y-3">
              {currentSolution.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">転送:</span>
                      <div className="font-medium">{step.from} → {step.to}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">ポイント:</span>
                      <div className="font-medium">{step.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">獲得:</span>
                      <div className="font-bold text-blue-600">{step.result.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">期間:</span>
                      <div className="font-medium">{step.time}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 合計 */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">獲得マイル合計:</span>
                  <span className="text-xl font-bold text-blue-900">
                    {currentSolution.steps.reduce((sum, step) => sum + step.result, 0).toLocaleString()}マイル
                  </span>
                </div>
                <div className="mt-2 text-sm text-blue-800">
                  目標: {currentCase.goal.totalMiles.toLocaleString()}マイル
                  {currentSolution.steps.reduce((sum, step) => sum + step.result, 0) >= currentCase.goal.totalMiles 
                    ? ' ✅ 達成' 
                    : ` (${(currentCase.goal.totalMiles - currentSolution.steps.reduce((sum, step) => sum + step.result, 0)).toLocaleString()}マイル不足)`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 実行チェックリスト */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 実行チェックリスト
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">事前準備</h4>
            <div className="space-y-2">
              {[
                '各プログラムのアカウント開設確認',
                '月間・年間転送上限の確認',
                'クレジットカード年会費の確認',
                '特典航空券の空席状況確認'
              ].map((item, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">実行時確認</h4>
            <div className="space-y-2">
              {[
                '転送レート・手数料の最新情報確認',
                '転送完了通知の受信確認',
                'マイル有効期限の確認',
                '特典航空券予約の実行'
              ].map((item, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransferCaseStudy;
