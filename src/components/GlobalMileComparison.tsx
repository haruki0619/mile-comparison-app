'use client';

import { useState } from 'react';
import { Globe, TrendingUp, Calculator, CreditCard, AlertCircle, Star, Zap } from 'lucide-react';
import PaymentComparison from './PaymentComparison';
import { AIRPORTS } from '../constants';

interface GlobalMileComparisonProps {
  onSearch?: (data: any) => void;
}

export default function GlobalMileComparison({ onSearch }: GlobalMileComparisonProps) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [showComparison, setShowComparison] = useState(false);

  // 主要国際ルートのプリセット
  const internationalRoutes = [
    { name: '東京 → ロサンゼルス', departure: 'NRT', arrival: 'LAX', popular: true },
    { name: '東京 → ニューヨーク', departure: 'NRT', arrival: 'JFK', popular: true },
    { name: '東京 → ロンドン', departure: 'NRT', arrival: 'LHR', popular: true },
    { name: '東京 → パリ', departure: 'NRT', arrival: 'CDG', popular: false },
    { name: '東京 → フランクフルト', departure: 'NRT', arrival: 'FRA', popular: false },
    { name: '東京 → シドニー', departure: 'NRT', arrival: 'SYD', popular: true },
    { name: '東京 → ソウル', departure: 'NRT', arrival: 'ICN', popular: true },
    { name: '東京 → 台北', departure: 'NRT', arrival: 'TPE', popular: true },
    { name: '大阪 → ロサンゼルス', departure: 'KIX', arrival: 'LAX', popular: false },
    { name: '大阪 → ロンドン', departure: 'KIX', arrival: 'LHR', popular: false }
  ];

  const handleQuickRoute = (route: any) => {
    setDeparture(route.departure);
    setArrival(route.arrival);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (departure && arrival && date) {
      setShowComparison(true);
      if (onSearch) {
        onSearch({
          departure,
          arrival,
          date,
          passengers,
          cabinClass
        });
      }
    }
  };

  const cabinClassOptions = [
    { value: 'economy', label: 'エコノミー', icon: '🛩️' },
    { value: 'business', label: 'ビジネス', icon: '✈️' },
    { value: 'first', label: 'ファースト', icon: '🛫' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">グローバルマイル比較</h1>
            <p className="text-xl text-gray-600 mt-2">世界中の航空会社マイルを一括比較・最適化</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">最適化提案</h3>
              <p className="text-sm text-gray-600">AI分析による最適な支払方法を提案</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ポイント移行</h3>
              <p className="text-sm text-gray-600">クレジットカードポイントの最適移行ルート</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">価値分析</h3>
              <p className="text-sm text-gray-600">マイルの実質価値と投資効率を分析</p>
            </div>
          </div>
        </div>
      </div>

      {/* 人気国際ルート */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">人気国際ルート</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {internationalRoutes.map((route, index) => (
            <button
              key={index}
              onClick={() => handleQuickRoute(route)}
              className={`p-4 border rounded-xl transition-all text-left hover:shadow-md ${
                route.popular 
                  ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{route.name}</span>
                {route.popular && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    人気
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600">{route.departure} → {route.arrival}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6" />
            グローバルマイル検索
          </h2>
          <p className="text-indigo-100 mt-1">
            世界主要航空会社のマイル要件を一括比較できます
          </p>
        </div>

        <form onSubmit={handleSearch} className="p-6 space-y-6">
          {/* ルート選択 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                出発地
              </label>
              <select
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                <option value="">出発空港を選択</option>
                {AIRPORTS.filter(airport => ['関東', '関西', '中部'].includes(airport.region || '')).map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} - {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                到着地
              </label>
              <select
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                <option value="">到着空港を選択</option>
                {AIRPORTS.filter(airport => ['アジア', '北米', 'ヨーロッパ', 'オセアニア'].includes(airport.region || '')).map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} - {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 詳細オプション */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                搭乗日
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                人数
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}名</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                座席クラス
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as 'economy' | 'business' | 'first')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {cabinClassOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 検索ボタン */}
          <button
            type="submit"
            disabled={!departure || !arrival || !date}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3"
          >
            <Globe className="h-6 w-6" />
            グローバルマイル比較を開始
          </button>
        </form>
      </div>

      {/* 検索結果 - 支払方法比較 */}
      {showComparison && departure && arrival && date && (
        <PaymentComparison
          route={{ departure, arrival, date }}
          passengers={passengers}
          cabinClass={cabinClass}
        />
      )}

      {/* 注意事項 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">ご利用上の注意</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• マイル要件は航空会社の規約変更により変動する場合があります</li>
              <li>• 表示される価値は推定値であり、実際の価値とは異なる場合があります</li>
              <li>• 特典航空券の空席状況は実際の予約サイトでご確認ください</li>
              <li>• ポイント移行にはカード会員資格が必要です</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
