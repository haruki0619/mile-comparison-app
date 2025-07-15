'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Plane, Calendar, Users, ArrowRight, MapPin, Star, Clock } from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { AIRPORTS } from '../constants';
import { getTodayString, validateSearchForm } from '../utils';

// 人数オプション
const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6];

// 人気ルートプリセット（国内・国際統合）
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
    { name: '東京 → ロサンゼルス', departure: 'NRT', arrival: 'LAX' },
    { name: '東京 → ニューヨーク', departure: 'NRT', arrival: 'JFK' },
    { name: '東京 → ロンドン', departure: 'NRT', arrival: 'LHR' },
    { name: '東京 → ソウル', departure: 'NRT', arrival: 'ICN' },
    { name: '東京 → ホノルル', departure: 'NRT', arrival: 'HNL' },
    { name: '東京 → バンコク', departure: 'NRT', arrival: 'BKK' },
    { name: '東京 → シドニー', departure: 'NRT', arrival: 'SYD' },
    { name: '東京 → 台北', departure: 'NRT', arrival: 'TPE' },
  ]
};

interface EnhancedSearchFormProps {
  onSearch: (data: SearchFormType) => void;
  isLoading?: boolean;
}

// 対象マイル種別の定義
type TargetMileType = 'UA' | 'ANA' | 'JAL' | 'SQ' | 'AA' | 'DL' | 'AC' | 'BA' | 'QR' | 'AF';
type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

interface MileProgram {
  code: TargetMileType;
  name: string;
  alliance: string;
  region: string;
  popular: boolean;
}

export default function EnhancedSearchForm({ 
  onSearch, 
  isLoading = false
}: EnhancedSearchFormProps) {
  // 基本検索状態
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedRouteType, setSelectedRouteType] = useState<'domestic' | 'international'>('domestic');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // 核心機能: 対象マイル種別の選択
  const [targetMileType, setTargetMileType] = useState<TargetMileType>('UA');
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');

  // マイレージプログラムの定義（核心機能用）
  const mileagePrograms: MileProgram[] = useMemo(() => [
    { code: 'UA', name: 'United MileagePlus', alliance: 'Star Alliance', region: '北米', popular: true },
    { code: 'ANA', name: 'ANAマイレージクラブ', alliance: 'Star Alliance', region: '日本', popular: true },
    { code: 'JAL', name: 'JALマイレージバンク', alliance: 'oneworld', region: '日本', popular: true },
    { code: 'SQ', name: 'Singapore Airlines KrisFlyer', alliance: 'Star Alliance', region: 'アジア', popular: true },
    { code: 'AA', name: 'American Airlines', alliance: 'oneworld', region: '北米', popular: true },
    { code: 'DL', name: 'Delta SkyMiles', alliance: 'SkyTeam', region: '北米', popular: true },
    { code: 'AC', name: 'Aeroplan (Air Canada)', alliance: 'Star Alliance', region: '北米', popular: false },
    { code: 'BA', name: 'British Airways Executive Club', alliance: 'oneworld', region: 'ヨーロッパ', popular: false },
    { code: 'QR', name: 'Qatar Airways Privilege Club', alliance: 'oneworld', region: '中東', popular: false },
    { code: 'AF', name: 'Air France KLM Flying Blue', alliance: 'SkyTeam', region: 'ヨーロッパ', popular: false },
  ], []);

  // 地域別空港グループ化
  const airportsByRegion = useMemo(() => {
    const grouped = AIRPORTS.reduce((acc, airport) => {
      const region = airport.region || 'その他';
      if (!acc[region]) acc[region] = [];
      acc[region].push(airport);
      return acc;
    }, {} as Record<string, typeof AIRPORTS>);

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
    if (validation) {
      alert(validation);
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
    if (dep && arr) {
      setDeparture(dep);
      setArrival(arr);
    }
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
    <div className="max-w-6xl mx-auto p-4 space-y-6">
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

      {/* メイン検索フォーム */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <Search className="w-6 h-6" />
              マイル比較検索
            </h2>
            
            {/* 対象マイル種別選択 */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">対象マイル:</span>
              <select
                value={targetMileType}
                onChange={(e) => setTargetMileType(e.target.value as TargetMileType)}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white text-sm font-medium focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              >
                {mileagePrograms.filter(p => p.popular).map(program => (
                  <option key={program.code} value={program.code} className="text-gray-900">
                    {program.code} - {program.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 出発地・到着地 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  出発地
                </label>
                {renderAirportSelect(departure, setDeparture, "出発空港を選択してください", arrival)}
              </div>
              
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

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  到着地
                </label>
                {renderAirportSelect(arrival, setArrival, "到着空港を選択してください", departure)}
              </div>
            </div>
          </div>

          {/* 日付・搭乗クラス・人数選択 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <label className="block text-sm font-medium text-gray-900 mb-3">座席クラス</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="economy">エコノミー</option>
                <option value="premium-economy">プレミアムエコノミー</option>
                <option value="business">ビジネス</option>
                <option value="first">ファースト</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                搭乗者数
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
            disabled={isLoading || !departure || !arrival || !date}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                検索中...
              </>
            ) : (
              <>
                <Search className="h-6 w-6" />
                {targetMileType}マイルで比較検索
                <ArrowRight className="h-6 w-6" />
              </>
            )}
          </button>
        </form>

        {/* ヘルプとTips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-t border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-1 flex-shrink-0 mt-0.5">
              <Plane className="w-3 h-3 text-white" />
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">マイル比較検索の使い方</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>対象マイル:</strong> 比較したいマイルプログラムを選択</li>
                <li>• <strong>ルート入力:</strong> 出発地と目的地を選択</li>
                <li>• <strong>自動比較:</strong> 他社マイルとの最適解を自動表示</li>
                <li>• <strong>現金換算:</strong> マイル価値を円換算で表示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
