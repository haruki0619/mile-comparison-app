'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// 転送ルートデータ型定義
interface TransferRoute {
  from: string;
  to: string;
  rate: number;
  rateDisplay: string;
  timeFrame: string;
  fee: string;
  maxAmount?: string;
  notes?: string;
  category: 'credit' | 'hotel' | 'local' | 'airline';
}

// 2025年最新転送ルートデータ
const transferRoutes: TransferRoute[] = [
  // クレジットカード系
  {
    from: 'Amex MR JP',
    to: 'ANA',
    rate: 1,
    rateDisplay: '1:1',
    timeFrame: '1-2週間',
    fee: '年会費に込',
    category: 'credit',
    notes: 'MR+加入必須'
  },
  {
    from: 'Amex MR JP',
    to: 'United',
    rate: 1,
    rateDisplay: '1:1',
    timeFrame: '即時',
    fee: '年会費に込',
    category: 'credit'
  },
  {
    from: 'Amex MR JP',
    to: 'British Airways',
    rate: 1,
    rateDisplay: '1:1',
    timeFrame: '即時',
    fee: '年会費に込',
    category: 'credit'
  },
  {
    from: 'JCB Oki Doki',
    to: 'ANA',
    rate: 3,
    rateDisplay: '1P:3M',
    timeFrame: '1-2週間',
    fee: '¥5,500/年',
    category: 'credit'
  },
  {
    from: '三井住友VISA',
    to: 'ANA',
    rate: 10,
    rateDisplay: '1P:10M',
    timeFrame: '2-4週間',
    fee: '¥6,600/年',
    maxAmount: '80,000P/年',
    category: 'credit'
  },
  {
    from: 'セゾン永久不滅',
    to: 'ANA',
    rate: 3,
    rateDisplay: '200P:600M',
    timeFrame: '3-5日',
    fee: '無料',
    category: 'credit'
  },
  {
    from: 'セゾン永久不滅',
    to: 'British Airways',
    rate: 2.5,
    rateDisplay: '200P:500A',
    timeFrame: '3-5日',
    fee: '無料',
    category: 'credit'
  },
  {
    from: '楽天ポイント',
    to: 'ANA',
    rate: 0.5,
    rateDisplay: '2P:1M',
    timeFrame: '翌月末',
    fee: '無料',
    maxAmount: '20,000M/月',
    category: 'local'
  },
  {
    from: 'dポイント',
    to: 'JAL',
    rate: 0.5,
    rateDisplay: '2P:1M',
    timeFrame: '2-7日',
    fee: '無料',
    maxAmount: '40,000M/月',
    category: 'local'
  },
  {
    from: 'Ponta',
    to: 'JAL',
    rate: 0.5,
    rateDisplay: '2P:1M',
    timeFrame: '即時',
    fee: '無料',
    maxAmount: '20,000M/月',
    category: 'local'
  },
  
  // ホテルポイント系
  {
    from: 'Marriott Bonvoy',
    to: 'ANA',
    rate: 0.33,
    rateDisplay: '3P:1M',
    timeFrame: '2-7日',
    fee: '無料',
    category: 'hotel',
    notes: '60,000pt→25,000M(ボーナス+5,000M)'
  },
  {
    from: 'Marriott Bonvoy',
    to: 'United',
    rate: 0.33,
    rateDisplay: '3P:1M',
    timeFrame: '即時',
    fee: '無料',
    category: 'hotel',
    notes: '60,000pt→25,000M(ボーナス+5,000M)'
  },
  {
    from: 'Marriott Bonvoy',
    to: 'British Airways',
    rate: 0.33,
    rateDisplay: '3P:1M',
    timeFrame: '2-3日',
    fee: '無料',
    category: 'hotel',
    notes: '60,000pt→25,000M(ボーナス+5,000M)'
  },
  {
    from: 'World of Hyatt',
    to: 'United',
    rate: 0.4,
    rateDisplay: '2.5P:1M',
    timeFrame: '即時',
    fee: '無料',
    category: 'hotel'
  },
  {
    from: 'Hilton Honors',
    to: 'ANA',
    rate: 0.1,
    rateDisplay: '10P:1M',
    timeFrame: '3-5日',
    fee: '無料',
    category: 'hotel'
  }
];

// 航空会社リスト
const airlines = [
  'ANA', 'JAL', 'United', 'British Airways', 'Singapore', 
  'American', 'Delta', 'Lufthansa', 'Air France', 'KLM'
];

interface TransferResult {
  route: TransferRoute;
  milesReceived: number;
  totalCost: string;
  efficiency: number; // 円/マイル
}

const MileTransferCalculator: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('ANA');
  const [pointAmount, setPointAmount] = useState<number>(10000);
  const [results, setResults] = useState<TransferResult[]>([]);
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  // 利用可能な転送元ソース
  const sources = Array.from(new Set(transferRoutes.map(route => route.from))).sort();

  // 転送計算
  const calculateTransfers = () => {
    if (!selectedSource || !pointAmount) return;

    const applicableRoutes = transferRoutes.filter(route => 
      route.from === selectedSource && 
      (showAllRoutes || route.to === selectedTarget)
    );

    const calculatedResults: TransferResult[] = applicableRoutes.map(route => {
      let milesReceived = Math.floor(pointAmount * route.rate);
      
      // Marriottの60,000pt→25,000M特別ボーナス計算
      if (route.from === 'Marriott Bonvoy' && pointAmount >= 60000) {
        const bonusBlocks = Math.floor(pointAmount / 60000);
        const bonusMiles = bonusBlocks * 5000;
        milesReceived += bonusMiles;
      }

      // 上限チェック
      if (route.maxAmount) {
        const maxValue = parseInt(route.maxAmount.replace(/[^\d]/g, ''));
        if (route.from.includes('楽天') || route.from.includes('dポイント') || route.from.includes('Ponta')) {
          // マイル上限の場合
          milesReceived = Math.min(milesReceived, maxValue);
        } else {
          // ポイント上限の場合
          const maxMiles = Math.floor(maxValue * route.rate);
          milesReceived = Math.min(milesReceived, maxMiles);
        }
      }

      // 手数料から効率計算（簡易）
      let feeValue = 0;
      if (route.fee.includes('¥')) {
        feeValue = parseInt(route.fee.replace(/[^\d]/g, ''));
      }

      const efficiency = milesReceived > 0 ? feeValue / milesReceived : 0;

      return {
        route,
        milesReceived,
        totalCost: route.fee,
        efficiency
      };
    });

    // 効率順にソート（手数料が低く、マイル数が多い順）
    calculatedResults.sort((a, b) => {
      if (a.efficiency === b.efficiency) {
        return b.milesReceived - a.milesReceived;
      }
      return a.efficiency - b.efficiency;
    });

    setResults(calculatedResults);
  };

  useEffect(() => {
    if (selectedSource && pointAmount) {
      calculateTransfers();
    }
  }, [selectedSource, selectedTarget, pointAmount, showAllRoutes]);

  // カテゴリ別の色分け
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'credit': return 'bg-blue-50 border-blue-200';
      case 'hotel': return 'bg-green-50 border-green-200';
      case 'local': return 'bg-orange-50 border-orange-200';
      case 'airline': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'credit': return 'クレジットカード';
      case 'hotel': return 'ホテルポイント';
      case 'local': return '国内ポイント';
      case 'airline': return '航空マイル';
      default: return 'その他';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          マイル転送計算機 2025年版
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              転送元ポイント
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              転送先マイル
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={showAllRoutes}
            >
              {airlines.map(airline => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ポイント数
            </label>
            <input
              type="number"
              value={pointAmount}
              onChange={(e) => setPointAmount(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              表示オプション
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showAllRoutes}
                onChange={(e) => setShowAllRoutes(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">全ルート表示</span>
            </label>
          </div>
        </div>

        <Button 
          onClick={calculateTransfers}
          className="w-full md:w-auto"
          disabled={!selectedSource || !pointAmount}
        >
          転送ルートを計算
        </Button>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            転送ルート結果 ({results.length}件)
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 ${getCategoryColor(result.route.category)}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryLabel(result.route.category)}
                      </span>
                      <h4 className="font-semibold text-lg">
                        {result.route.from} → {result.route.to}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">転送レート:</span>
                        <div className="font-medium">{result.route.rateDisplay}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">所要時間:</span>
                        <div className="font-medium">{result.route.timeFrame}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">手数料:</span>
                        <div className="font-medium">{result.route.fee}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">獲得マイル:</span>
                        <div className="font-bold text-blue-600">
                          {result.milesReceived.toLocaleString()}マイル
                        </div>
                      </div>
                    </div>

                    {result.route.maxAmount && (
                      <div className="mt-2 text-xs text-orange-600">
                        上限: {result.route.maxAmount}
                      </div>
                    )}

                    {result.route.notes && (
                      <div className="mt-2 text-xs text-gray-600">
                        注意: {result.route.notes}
                      </div>
                    )}
                  </div>

                  {index === 0 && (
                    <div className="mt-3 md:mt-0 md:ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        最適ルート
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {results.length > 1 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 転送ルート選択のポイント</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>時間重視</strong>: 即時転送可能なルートを優先</li>
                <li>• <strong>コスト重視</strong>: 手数料無料または低額のルートを選択</li>
                <li>• <strong>効率重視</strong>: 転送レートが高いルートを活用</li>
                <li>• <strong>上限注意</strong>: 月間・年間上限を確認して計画的に転送</li>
              </ul>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🚀 転送戦略ガイド
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">目的別推奨ルート</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>緊急時（即時転送）:</span>
                <span className="font-medium">Amex MR → UA/BA</span>
              </div>
              <div className="flex justify-between">
                <span>コスト最優先:</span>
                <span className="font-medium">セゾン永久不滅</span>
              </div>
              <div className="flex justify-between">
                <span>国内線特化:</span>
                <span className="font-medium">Ponta → JAL</span>
              </div>
              <div className="flex justify-between">
                <span>長距離国際線:</span>
                <span className="font-medium">Marriott → 各社</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">注意事項</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 転送後のマイル有効期限を確認</li>
              <li>• 月間・年間の転送上限に注意</li>
              <li>• 特典航空券の空席状況も確認</li>
              <li>• キャンペーン時期の活用を検討</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MileTransferCalculator;
