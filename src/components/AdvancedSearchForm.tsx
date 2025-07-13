'use client';

import { useState, useMemo } from 'react';
import { Search, Plane, Calendar, Users, ArrowRight, MapPin, Star } from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { AIRPORTS } from '../constants';
import { getTodayString, validateSearchForm } from '../utils';

// 人数オプション
const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6];

// 人気ルートプリセット
const POPULAR_ROUTES = [
  { name: '東京 → 大阪', departure: 'HND', arrival: 'ITM' },
  { name: '東京 → 沖縄', departure: 'NRT', arrival: 'OKA' },
  { name: '東京 → 札幌', departure: 'HND', arrival: 'CTS' },
  { name: '大阪 → 沖縄', departure: 'KIX', arrival: 'OKA' },
  { name: '東京 → 福岡', departure: 'HND', arrival: 'FUK' },
  { name: '東京 → ソウル', departure: 'NRT', arrival: 'ICN' },
  { name: '東京 → ロサンゼルス', departure: 'NRT', arrival: 'LAX' },
  { name: '東京 → ロンドン', departure: 'NRT', arrival: 'LHR' },
];

interface AdvancedSearchFormProps {
  onSearch: (data: SearchFormType) => void;
  isLoading?: boolean;
}

export default function AdvancedSearchForm({ onSearch, isLoading = false }: AdvancedSearchFormProps) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

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

    onSearch(formData);
  };

  const handlePopularRoute = (route: typeof POPULAR_ROUTES[0]) => {
    setDeparture(route.departure);
    setArrival(route.arrival);
  };

  const renderAirportSelect = (value: string, onChange: (value: string) => void, placeholder: string) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
      required
    >
      <option value="">{placeholder}</option>
      {Object.entries(airportsByRegion).map(([region, airports]) => (
        <optgroup key={region} label={`🌏 ${region}`}>
          {airports.map(airport => (
            <option key={airport.code} value={airport.code}>
              {airport.city} - {airport.name} ({airport.code})
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-full">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">マイル航空券検索</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          世界中の航空会社のマイル要件を一括比較。最適なルートと必要マイル数を見つけましょう。
        </p>
      </div>

      {/* 人気ルートプリセット */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">人気ルート</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {POPULAR_ROUTES.map((route, index) => (
            <button
              key={index}
              onClick={() => handlePopularRoute(route)}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-blue-700"
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
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Search className="w-6 h-6" />
            マイル・航空券検索
          </h2>
          <p className="text-blue-100 mt-2">
            出発地、到着地、搭乗日を入力して最適なマイル数を検索できます。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 出発地・到着地 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                出発地
              </label>
              {renderAirportSelect(departure, setDeparture, "出発空港を選択してください")}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                到着地
              </label>
              {renderAirportSelect(arrival, setArrival, "到着空港を選択してください")}
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

          {/* 検索ボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg"
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
          <p className="text-sm text-blue-700">
            💡 <strong>検索のコツ:</strong> 
            人気ルートボタンで素早く入力、出発日を柔軟に設定することで最適なマイル数を見つけられます。
          </p>
        </div>
      </div>
    </div>
  );
}
