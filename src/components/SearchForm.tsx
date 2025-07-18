'use client';

import { useState, useMemo } from 'react';
import { Search, Plane, Calendar, Users, ArrowRight, MapPin, Award, Info } from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { AIRPORTS } from '../constants';
import { getTodayString, validateSearchForm } from '../utils';

// 人数オプション
const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6];

// マイレージプログラムオプション
const MILEAGE_PROGRAMS = [
  { code: 'ANA', name: 'ANAマイレージクラブ', alliance: 'Star Alliance' },
  { code: 'JAL', name: 'JALマイレージバンク', alliance: 'oneworld' },
  { code: 'DL', name: 'デルタスカイマイル', alliance: 'SkyTeam' },
  { code: 'UA', name: 'ユナイテッド マイレージプラス', alliance: 'Star Alliance' },
  { code: 'AA', name: 'アメリカン・アドバンテージ', alliance: 'oneworld' },
  { code: 'AC', name: 'エアカナダ アエロプラン', alliance: 'Star Alliance' },
  { code: 'AF', name: 'エールフランス・KLM フライングブルー', alliance: 'SkyTeam' },
  { code: 'BA', name: 'ブリティッシュエアウェイズ エグゼクティブクラブ', alliance: 'oneworld' }
];

interface SearchFormProps {
  onSearch: (data: SearchFormType & { mileageProgram?: string }) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [mileageProgram, setMileageProgram] = useState('');

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

  const renderAirportSelect = (value: string, onChange: (value: string) => void, placeholder: string) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
      required
    >
      <option value="">{placeholder}</option>
      {Object.entries(airportsByRegion).map(([region, airports]) => (
        <optgroup key={region} label={`${region}`}>
          {airports.map(airport => (
            <option key={airport.code} value={airport.code}>
              {airport.city} - {airport.name} ({airport.code})
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = { departure, arrival, date, passengers, mileageProgram };
    const validationError = validateSearchForm(form);
    
    if (validationError) {
      alert(validationError);
      return;
    }

    onSearch(form);
  };

  // Quick preset buttons - 国内線を優先
  const popularRoutes = [
    { from: 'HND', to: 'ITM', label: '東京→大阪' },
    { from: 'NRT', to: 'OKA', label: '東京→沖縄' },
    { from: 'HND', to: 'CTS', label: '東京→札幌' },
    { from: 'HND', to: 'FUK', label: '東京→福岡' }
  ];

  const setQuickRoute = (from: string, to: string) => {
    setDeparture(from);
    setArrival(to);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <Search className="h-6 w-6" />
          マイル・航空券検索
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          最新のマイル表で最適なルートを見つけましょう
        </p>
      </div>

      <div className="p-6">
        {/* Quick Route Presets */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">人気ルート</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => setQuickRoute(route.from, route.to)}
                className="p-2 text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 rounded-lg transition-colors text-center"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Selection */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Departure */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  出発地
                </label>
                {renderAirportSelect(departure, setDeparture, "出発地を選択")}
              </div>

              {/* Arrow */}
              <div className="flex justify-center items-center">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              {/* Arrival */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  到着地
                </label>
                {renderAirportSelect(arrival, setArrival, "到着地を選択")}
              </div>
            </div>
          </div>

          {/* Date & Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                出発日
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
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

          {/* Mileage Program Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="h-4 w-4 inline mr-1" />
              マイレージプログラム（任意）
            </label>
            <select
              value={mileageProgram}
              onChange={(e) => setMileageProgram(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">すべてのプログラムを比較</option>
              {MILEAGE_PROGRAMS.map(program => (
                <option key={program.code} value={program.code}>
                  {program.name} ({program.alliance})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              特定のマイレージプログラムを選択すると、そのプログラムでの最適な特典航空券を優先表示します
            </p>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !departure || !arrival || !date}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                検索中...
              </>
            ) : (
              <>
                <Plane className="h-5 w-5" />
                マイル・航空券を検索
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>検索のコツ:</strong> 
              人気ルートボタンで素早く入力、出発日を柔軟に設定することで最適なマイル数を見つけられます。
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
