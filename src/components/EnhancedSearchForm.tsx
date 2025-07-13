'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Plane, Calendar, Users, ArrowRight, MapPin, Star, Filter, Check, Clock } from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { AIRPORTS } from '../constants';
import { getTodayString, validateSearchForm } from '../utils';

// 人数オプション
const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6];

// 人気ルートプリセット（国内・国際分け）
const POPULAR_ROUTES = {
  domestic: [
    { name: '東京 → 大阪', departure: 'HND', arrival: 'ITM' },
    { name: '東京 → 沖縄', departure: 'NRT', arrival: 'OKA' },
    { name: '東京 → 札幌', departure: 'HND', arrival: 'CTS' },
    { name: '大阪 → 沖縄', departure: 'KIX', arrival: 'OKA' },
    { name: '東京 → 福岡', departure: 'HND', arrival: 'FUK' },
    { name: '大阪 → 札幌', departure: 'KIX', arrival: 'CTS' },
  ],
  international: [
    { name: '東京 → ソウル', departure: 'NRT', arrival: 'ICN' },
    { name: '東京 → ロサンゼルス', departure: 'NRT', arrival: 'LAX' },
    { name: '東京 → ロンドン', departure: 'NRT', arrival: 'LHR' },
    { name: '東京 → ホノルル', departure: 'NRT', arrival: 'HNL' },
    { name: '大阪 → パリ', departure: 'KIX', arrival: 'CDG' },
    { name: '東京 → バンコク', departure: 'NRT', arrival: 'BKK' },
  ]
};

interface EnhancedSearchFormProps {
  onSearch: (data: SearchFormType) => void;
  isLoading?: boolean;
}

export default function EnhancedSearchForm({ onSearch, isLoading = false }: EnhancedSearchFormProps) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedRouteType, setSelectedRouteType] = useState<'domestic' | 'international'>('domestic');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 地域別空港グループ化
  const airportsByRegion = useMemo(() => {
    const grouped = AIRPORTS.reduce((acc, airport) => {
      const region = airport.region || 'その他';
      if (!acc[region]) acc[region] = [];
      acc[region].push(airport);
      return acc;
    }, {} as Record<string, typeof AIRPORTS>);

    // 地域の順序を定義
    const regionOrder = ['関東', '関西', '中部', '北海道', '東北', '中国', '四国', '九州', '沖縄', 'アジア', '北米', 'ヨーロッパ', 'オセアニア', 'その他'];
    
    const orderedGrouped: Record<string, typeof AIRPORTS> = {};
    regionOrder.forEach(region => {
      if (grouped[region]) {
        orderedGrouped[region] = grouped[region];
      }
    });

    return orderedGrouped;
  }, []);

  // 検索履歴の読み込み（初回のみ）
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mileSearchHistory');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: SearchFormType = {
      departure,
      arrival,
      date,
      passengers,
    };

    const validation = validateSearchForm(formData);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    // 検索履歴に追加
    const searchKey = `${departure}-${arrival}`;
    if (!searchHistory.includes(searchKey)) {
      const newHistory = [searchKey, ...searchHistory.slice(0, 4)]; // 最大5件
      setSearchHistory(newHistory);
      try {
        localStorage.setItem('mileSearchHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
    }

    onSearch(formData);
  };

  const handlePopularRoute = (route: typeof POPULAR_ROUTES.domestic[0]) => {
    setDeparture(route.departure);
    setArrival(route.arrival);
  };

  const handleHistoryRoute = (historyItem: string) => {
    const [dep, arr] = historyItem.split('-');
    setDeparture(dep);
    setArrival(arr);
  };

  const swapAirports = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const renderAirportSelect = (value: string, onChange: (value: string) => void, placeholder: string, excludeCode?: string) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
      required
    >
      <option value="">{placeholder}</option>
      {Object.entries(airportsByRegion).map(([region, airports]) => (
        <optgroup key={region} label={`🌏 ${region}`}>
          {airports
            .filter(airport => airport.code !== excludeCode)
            .map(airport => (
              <option key={airport.code} value={airport.code}>
                {airport.city} - {airport.name} ({airport.code})
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-full">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">マイル航空券検索</h1>
            <p className="text-gray-600 mt-1">世界中の航空会社のマイル要件を一括比較</p>
          </div>
        </div>
      </div>

      {/* 検索履歴 */}
      {searchHistory.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            最近の検索
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => {
              const [dep, arr] = item.split('-');
              const depAirport = AIRPORTS.find(a => a.code === dep);
              const arrAirport = AIRPORTS.find(a => a.code === arr);
              return (
                <button
                  key={index}
                  onClick={() => handleHistoryRoute(item)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {depAirport?.city} → {arrAirport?.city}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 人気ルートプリセット */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">人気ルート</h2>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedRouteType('domestic')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedRouteType === 'domestic'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              国内線
            </button>
            <button
              onClick={() => setSelectedRouteType('international')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedRouteType === 'international'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              国際線
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_ROUTES[selectedRouteType].map((route, index) => (
            <button
              key={index}
              onClick={() => handlePopularRoute(route)}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 text-center"
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* フォームヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Search className="w-6 h-6" />
                マイル・航空券検索
              </h2>
              <p className="text-blue-100 mt-1">
                出発地、到着地、搭乗日を入力して最適なマイル数を検索できます。
              </p>
            </div>
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-blue-100 hover:text-white flex items-center gap-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              {showAdvancedOptions ? '簡単検索' : '詳細検索'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 出発地・到着地 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              {/* 出発地 */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  出発地
                </label>
                {renderAirportSelect(departure, setDeparture, "出発空港を選択してください", arrival)}
              </div>
              
              {/* 交換ボタン */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapAirports}
                  className="p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  title="出発地と到着地を交換"
                >
                  <ArrowRight className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* 到着地 */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  到着地
                </label>
                {renderAirportSelect(arrival, setArrival, "到着空港を選択してください", departure)}
              </div>
            </div>
          </div>

          {/* 搭乗日・人数 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                搭乗日
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayString()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                人数
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                {PASSENGER_OPTIONS.map(num => (
                  <option key={num} value={num}>
                    {num}名
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 詳細オプション */}
          {showAdvancedOptions && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-medium text-gray-900 mb-3">詳細オプション</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm text-gray-700">ビジネスクラスも含める</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm text-gray-700">乗り継ぎ便も含める</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 検索ボタン */}
          <button
            type="submit"
            disabled={isLoading || !departure || !arrival || !date}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                検索中...
              </>
            ) : (
              <>
                <Search className="h-6 w-6" />
                マイル・航空券を検索
                <ArrowRight className="h-6 w-6" />
              </>
            )}
          </button>
        </form>

        {/* ヘルプテキスト */}
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-1 flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">検索のコツ</p>
              <ul className="space-y-1 text-xs">
                <li>• 人気ルートボタンで素早く入力できます</li>
                <li>• 出発日を柔軟に設定することで最適なマイル数を見つけられます</li>
                <li>• 地域別に空港が整理されているので、目的地を見つけやすくなっています</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
