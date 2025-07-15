// 包括的マイルプログラム選択・比較コンポーネント
'use client';

import { useState, useMemo, useCallback } from 'react';
import { 
  Search, 
  Plane, 
  Calendar, 
  Users, 
  ArrowRight, 
  MapPin, 
  Star, 
  Clock,
  Award,
  Check,
  Plus,
  X,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { AIRPORTS } from '../constants';
import { getTodayString, validateSearchForm } from '../utils';
import { airlineMileValues } from '../utils/airlineMileValues';

// 包括的マイルプログラム定義
interface ComprehensiveMileProgram {
  id: string;
  code: string;
  name: string;
  shortName: string;
  alliance: string;
  region: string;
  baseValue: number;
  popular: boolean;
  color: string;
  airlines: string[];
  strengths: string[];
  limitations: string[];
}

interface AdvancedSearchFormProps {
  onSearch: (data: SearchFormType) => void;
  isLoading?: boolean;
}

const MILE_PROGRAMS: ComprehensiveMileProgram[] = [
  // 日本で最も人気・認知度の高いマイレージ制度
  {
    id: 'ANA',
    code: 'ANA',
    name: 'ANAマイレージクラブ',
    shortName: 'ANA',
    alliance: 'Star Alliance',
    region: '日本',
    baseValue: 2.0,
    popular: true,
    color: 'bg-blue-600',
    airlines: ['ANA', 'ユナイテッド航空', 'ルフトハンザ', 'シンガポール航空'],
    strengths: ['国内線充実', 'とく旅マイル', 'Star Alliance'],
    limitations: ['燃油サーチャージあり', '特典枠取りにくい']
  },
  {
    id: 'JAL',
    code: 'JAL',
    name: 'JALマイレージバンク',
    shortName: 'JAL',
    alliance: 'oneworld',
    region: '日本',
    baseValue: 2.2,
    popular: true,
    color: 'bg-red-600',
    airlines: ['JAL', 'アメリカン航空', 'ブリティッシュ・エアウェイズ', 'カタール航空'],
    strengths: ['Award Ticket PLUS', 'oneworld充実', '変動制で柔軟'],
    limitations: ['燃油サーチャージあり', 'PLUS制で価格変動']
  },
  // 海外系で日本でも比較的知名度が高い
  {
    id: 'United',
    code: 'United',
    name: 'United MileagePlus',
    shortName: 'United',
    alliance: 'Star Alliance',
    region: '北米',
    baseValue: 1.8,
    popular: true,
    color: 'bg-indigo-600',
    airlines: ['ユナイテッド航空', 'ANA', 'ルフトハンザ', 'シンガポール航空'],
    strengths: ['燃油無料', 'Excursionist Perk', '変更手数料無料'],
    limitations: ['変動制価格', '特典枠限定的']
  },
  {
    id: 'Singapore',
    code: 'Singapore',
    name: 'Singapore Airlines KrisFlyer',
    shortName: 'シンガポール航空',
    alliance: 'Star Alliance',
    region: 'アジア',
    baseValue: 2.0,
    popular: true,
    color: 'bg-teal-600',
    airlines: ['シンガポール航空', 'ANA', 'ユナイテッド航空', 'ルフトハンザ'],
    strengths: ['固定制', 'ストップオーバー', '高品質サービス'],
    limitations: ['特典航空券取りにくい', '燃油サーチャージあり']
  },
  // マニア向け・上級者向けマイレージ制度
  {
    id: 'Virgin',
    code: 'Virgin',
    name: 'Virgin Atlantic Flying Club',
    shortName: 'Virgin → ANA',
    alliance: 'なし',
    region: 'ヨーロッパ',
    baseValue: 3.0,
    popular: false,
    color: 'bg-pink-600',
    airlines: ['Virgin Atlantic', 'ANA', 'デルタ航空'],
    strengths: ['ANA破格レート', 'ビジネスクラス特化', '入手可能'],
    limitations: ['限定ルート', '入手方法限定', 'ANA特典のみ']
  },
  {
    id: 'Alaska',
    code: 'Alaska',
    name: 'Alaska Mileage Plan',
    shortName: 'Alaska',
    alliance: 'なし',
    region: '北米',
    baseValue: 2.5,
    popular: false,
    color: 'bg-green-600',
    airlines: ['Alaska Airlines', 'JAL', 'アメリカン航空'],
    strengths: ['JAL燃油無料', '変更手数料無料', '豊富なパートナー'],
    limitations: ['Alaska便少ない', '入手方法限定']
  },
  {
    id: 'British',
    code: 'British',
    name: 'British Airways Executive Club',
    shortName: 'BA Avios',
    alliance: 'oneworld',
    region: 'ヨーロッパ',
    baseValue: 1.5,
    popular: false,
    color: 'bg-purple-600',
    airlines: ['ブリティッシュ・エアウェイズ', 'JAL', 'アメリカン航空', 'カタール航空'],
    strengths: ['距離ベース', '短距離特化', '豊富なパートナー'],
    limitations: ['長距離高額', '燃油サーチャージ高']
  },
  {
    id: 'Aeroplan',
    code: 'Aeroplan',
    name: 'Air Canada Aeroplan',
    shortName: 'Aeroplan',
    alliance: 'Star Alliance',
    region: '北米',
    baseValue: 1.8,
    popular: false,
    color: 'bg-gray-600',
    airlines: ['エアカナダ', 'ANA', 'ユナイテッド航空', 'ルフトハンザ'],
    strengths: ['燃油無料', 'ストップオーバー', '変更手数料無料'],
    limitations: ['入手方法限定', '特典枠限定的']
  }
];

export default function AdvancedSearchForm({ 
  onSearch, 
  isLoading = false 
}: AdvancedSearchFormProps) {
  // 基本検索状態
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  
  // 拡張検索状態
  const [selectedMilePrograms, setSelectedMilePrograms] = useState<string[]>(['ANA']);
  const [comparisonMode, setComparisonMode] = useState<'single' | 'multiple' | 'all'>('single');
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);
  const [showMileProgramDetails, setShowMileProgramDetails] = useState(false);
  const [resetNotification, setResetNotification] = useState<string | null>(null);

  // 人気プログラムと全プログラムの分離
  const popularPrograms = useMemo(() => MILE_PROGRAMS.filter(p => p.popular), []);
  const otherPrograms = useMemo(() => MILE_PROGRAMS.filter(p => !p.popular), []);

  // 比較モード変更時のリセット処理
  const handleComparisonModeChange = useCallback((newMode: 'single' | 'multiple' | 'all') => {
    setComparisonMode(newMode);
    
    // 複数→単一への切り替え時にリセット
    if (newMode === 'single' && selectedMilePrograms.length > 1) {
      const firstProgram = selectedMilePrograms[0];
      const resetProgram = firstProgram ? firstProgram : 'ANA';
      setSelectedMilePrograms([resetProgram]);
      setResetNotification(`複数選択から単一選択に変更したため、${MILE_PROGRAMS.find(p => p.id === resetProgram)?.shortName || 'ANA'}のみ選択されました`);
      
      // 3秒後に通知を消す
      setTimeout(() => setResetNotification(null), 3000);
    }
    // 単一→複数への切り替え時は選択を維持
    // all モードの場合は選択をクリア
    if (newMode === 'all') {
      setSelectedMilePrograms([]);
      setResetNotification('全マイレージ比較モードに変更しました。個別選択は不要です');
      setTimeout(() => setResetNotification(null), 3000);
    }
  }, [selectedMilePrograms]);

  // マイルプログラム選択ハンドラー
  const handleMileProgramToggle = useCallback((programId: string) => {
    setSelectedMilePrograms(prev => {
      if (comparisonMode === 'single') {
        return [programId];
      } else {
        return prev.includes(programId) 
          ? prev.filter(id => id !== programId)
          : [...prev, programId];
      }
    });
  }, [comparisonMode]);

  // 空港選択セクション
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

  const renderAirportSelect = (value: string, onChange: (value: string) => void, placeholder: string) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
      required
    >
      <option value="">{placeholder}</option>
      {Object.entries(airportsByRegion).map(([region, airports]) => (
        <optgroup key={region} label={region}>
          {airports.map((airport) => (
            <option key={airport.code} value={airport.code}>
              {airport.code} - {airport.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );

  // マイルプログラム選択コンポーネント
  const renderMileProgramCard = (program: ComprehensiveMileProgram) => {
    const isSelected = selectedMilePrograms.includes(program.id);
    
    return (
      <div
        key={program.id}
        onClick={() => handleMileProgramToggle(program.id)}
        className={`
          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }
        `}
      >
        {/* 選択インジケーター */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <Check className="h-5 w-5 text-blue-600" />
          </div>
        )}

        {/* プログラム情報 */}
        <div className="flex items-start gap-3">
          <div className={`w-4 h-4 rounded-full ${program.color} flex-shrink-0 mt-1`} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">{program.shortName}</h3>
            <p className="text-xs text-gray-600 mb-2">{program.alliance} • {program.region}</p>
            
            {/* 基準価値 */}
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium text-gray-700">
                基準: {program.baseValue.toFixed(1)}円/マイル
              </span>
            </div>

            {/* 詳細情報（展開時） */}
            {showMileProgramDetails && (
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">強み:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {program.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <Plus className="h-3 w-3 text-green-500" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-700 mb-1">制限:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {program.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <X className="h-3 w-3 text-red-500" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 検索実行
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchData: SearchFormType = {
      departure,
      arrival,
      date,
      passengers,
      targetMilePrograms: selectedMilePrograms,
      comparisonMode,
      showAllTimeSlots,
      ...(tripType === 'roundTrip' && returnDate ? { returnDate } : {})
    };

    // 基本的なバリデーション
    if (!departure || !arrival || !date) {
      alert('出発地、到着地、出発日は必須です。');
      return;
    }

    if (tripType === 'roundTrip' && !returnDate) {
      alert('往復の場合は復路日程も必須です。');
      return;
    }

    if (comparisonMode !== 'all' && selectedMilePrograms.length === 0) {
      alert('マイレージ制度を選択してください。');
      return;
    }

    onSearch(searchData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">包括マイル比較検索</h2>
            <p className="text-sm text-gray-600">複数のマイルプログラムで最適な特典航空券を比較</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本検索項目 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                出発地
              </label>
              {renderAirportSelect(departure, setDeparture, '出発空港を選択')}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                到着地
              </label>
              {renderAirportSelect(arrival, setArrival, '到着空港を選択')}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                出発日
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayString()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                人数
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}人</option>
                ))}
              </select>
            </div>
          </div>

          {/* 片道・往復選択 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Plane className="h-4 w-4" />
              旅行タイプ
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={tripType === 'oneWay'}
                  onChange={(e) => setTripType(e.target.value as 'oneWay' | 'roundTrip')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">片道</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="roundTrip"
                  checked={tripType === 'roundTrip'}
                  onChange={(e) => setTripType(e.target.value as 'oneWay' | 'roundTrip')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">往復</span>
              </label>
            </div>
          </div>

          {/* 復路日付（往復の場合のみ表示） */}
          {tripType === 'roundTrip' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                復路日
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={date || getTodayString()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* 比較モード選択 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Award className="h-4 w-4" />
              比較モード
            </label>
            <div className="flex gap-3">
              {[
                { value: 'single', label: '単一マイレージ', desc: '1つのマイレージ制度で最適解を検索' },
                { value: 'multiple', label: '複数マイレージ比較', desc: '選択したマイレージ制度間で比較' },
                { value: 'all', label: '全マイレージ比較', desc: 'すべてのマイレージ制度で包括比較' }
              ].map(mode => (
                <label
                  key={mode.value}
                  className={`
                    flex-1 p-3 rounded-lg border cursor-pointer transition-all
                    ${comparisonMode === mode.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="comparisonMode"
                    value={mode.value}
                    checked={comparisonMode === mode.value}
                    onChange={(e) => handleComparisonModeChange(e.target.value as 'single' | 'multiple' | 'all')}
                    className="sr-only"
                  />
                  <div className="text-sm font-medium text-gray-900">{mode.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{mode.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* リセット通知 */}
          {resetNotification && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">{resetNotification}</span>
              </div>
            </div>
          )}

          {/* マイレージ制度選択 */}
          {comparisonMode !== 'all' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Star className="h-4 w-4" />
                  対象マイレージ制度
                  {comparisonMode === 'multiple' && (
                    <span className="text-xs text-gray-500">（複数選択可能）</span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setShowMileProgramDetails(!showMileProgramDetails)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  {showMileProgramDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showMileProgramDetails ? '詳細を隠す' : '詳細を表示'}
                </button>
              </div>

              {/* 人気プログラム */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">人気プログラム</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {popularPrograms.map(renderMileProgramCard)}
                </div>
              </div>

              {/* その他のプログラム */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">その他のプログラム</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {otherPrograms.map(renderMileProgramCard)}
                </div>
              </div>
            </div>
          )}

          {/* 表示オプション */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">表示オプション</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllTimeSlots}
                  onChange={(e) => setShowAllTimeSlots(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  同じ航空会社の複数便を表示
                  <span className="text-xs text-gray-500 ml-1">（時間帯別の比較が可能）</span>
                </span>
              </label>
            </div>
          </div>

          {/* 検索ボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                検索中...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                マイル価値比較検索を実行
              </>
            )}
          </button>

          {/* 選択サマリー */}
          {selectedMilePrograms.length > 0 && comparisonMode !== 'all' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">選択中のプログラム:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMilePrograms.map(programId => {
                  const program = MILE_PROGRAMS.find(p => p.id === programId);
                  return program ? (
                    <span
                      key={programId}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm"
                    >
                      <div className={`w-3 h-3 rounded-full ${program.color}`} />
                      {program.shortName}
                      <span className="text-xs text-gray-500">({program.baseValue.toFixed(1)}円/マイル)</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
