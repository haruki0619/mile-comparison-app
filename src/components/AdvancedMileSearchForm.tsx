// マルチマイル検索フォーム - Phase 1実装
'use client';

import { useState } from 'react';
import { Search, Plane, CreditCard, TrendingUp } from 'lucide-react';

interface AdvancedMileSearch {
  departure: string;
  arrival: string;
  airlines: ('UA' | 'JAL' | 'ANA' | 'Delta' | 'AA' | 'SQ')[];
  travelClass: 'economy' | 'business' | 'first';
  flexibility: 'exact' | 'flexible_dates' | 'flexible_months';
  passengers: number;
}

interface MileSearchResult {
  airline: string;
  route: { departure: string; arrival: string; };
  requiredMiles: {
    economy: number;
    business: number;
    first: number;
  };
  cashEquivalent: number;
  valuePerMile: number;
  transferOptions: {
    creditCard: string;
    transferRatio: string;
    bonus: number;
  }[];
  availabilityScore: number; // 0-100
}

const AIRLINES = [
  { code: 'UA', name: 'United Airlines', alliance: 'Star Alliance' },
  { code: 'JAL', name: 'JAL', alliance: 'oneworld' },
  { code: 'ANA', name: 'ANA', alliance: 'Star Alliance' },
  { code: 'Delta', name: 'Delta', alliance: 'SkyTeam' },
  { code: 'AA', name: 'American Airlines', alliance: 'oneworld' },
  { code: 'SQ', name: 'Singapore Airlines', alliance: 'Star Alliance' }
];

const CREDIT_CARDS = [
  {
    name: 'JALカード',
    issuer: 'JAL',
    signupBonus: 5000,
    annualFee: 2200,
    mileEarnRate: 1.0,
    targetAirlines: ['JAL'],
    affiliateLink: '#jal-card-affiliate',
    commission: 8000
  },
  {
    name: 'ANAアメリカン・エキスプレス・カード',
    issuer: 'ANA',
    signupBonus: 10000,
    annualFee: 7700,
    mileEarnRate: 1.0,
    targetAirlines: ['ANA'],
    affiliateLink: '#ana-amex-affiliate',
    commission: 12000
  },
  {
    name: 'SPGアメックス',
    issuer: 'Amex',
    signupBonus: 30000,
    annualFee: 34100,
    mileEarnRate: 1.25,
    targetAirlines: ['JAL', 'ANA', 'UA', 'Delta'],
    affiliateLink: '#spg-amex-affiliate',
    commission: 15000
  }
];

export default function AdvancedMileSearchForm() {
  const [searchForm, setSearchForm] = useState<AdvancedMileSearch>({
    departure: '',
    arrival: '',
    airlines: [],
    travelClass: 'economy',
    flexibility: 'exact',
    passengers: 1
  });
  
  const [searchResults, setSearchResults] = useState<MileSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAirlineToggle = (airlineCode: 'UA' | 'JAL' | 'ANA' | 'Delta' | 'AA' | 'SQ') => {
    setSearchForm(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airlineCode)
        ? prev.airlines.filter(a => a !== airlineCode)
        : [...prev.airlines, airlineCode]
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    
    // モックデータ - 実際はAPI呼び出し
    const mockResults: MileSearchResult[] = [
      {
        airline: 'JAL',
        route: { departure: searchForm.departure, arrival: searchForm.arrival },
        requiredMiles: { economy: 12000, business: 24000, first: 40000 },
        cashEquivalent: 35000,
        valuePerMile: 2.9,
        transferOptions: [
          { creditCard: 'JALカード', transferRatio: '1:1', bonus: 0 },
          { creditCard: 'SPGアメックス', transferRatio: '3:1', bonus: 25 }
        ],
        availabilityScore: 75
      },
      {
        airline: 'ANA',
        route: { departure: searchForm.departure, arrival: searchForm.arrival },
        requiredMiles: { economy: 12000, business: 23000, first: 38000 },
        cashEquivalent: 35000,
        valuePerMile: 2.9,
        transferOptions: [
          { creditCard: 'ANAアメックス', transferRatio: '1:1', bonus: 0 },
          { creditCard: 'SPGアメックス', transferRatio: '3:1', bonus: 25 }
        ],
        availabilityScore: 85
      }
    ];

    setTimeout(() => {
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  const getRecommendedCards = (result: MileSearchResult) => {
    return CREDIT_CARDS.filter(card => 
      card.targetAirlines.includes(result.airline) ||
      card.targetAirlines.length > 2 // マルチ航空会社対応カード
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 高度な検索フォーム */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-600" />
          マルチマイル検索 - 最適ルートを発見
        </h2>

        {/* 基本ルート */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">出発地</label>
            <select
              value={searchForm.departure}
              onChange={(e) => setSearchForm(prev => ({ ...prev, departure: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              <option value="NRT">成田国際空港 (NRT)</option>
              <option value="HND">羽田空港 (HND)</option>
              <option value="KIX">関西国際空港 (KIX)</option>
              <option value="NGO">中部国際空港 (NGO)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">到着地</label>
            <select
              value={searchForm.arrival}
              onChange={(e) => setSearchForm(prev => ({ ...prev, arrival: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              <option value="LAX">ロサンゼルス (LAX)</option>
              <option value="SFO">サンフランシスコ (SFO)</option>
              <option value="JFK">ニューヨーク (JFK)</option>
              <option value="LHR">ロンドン (LHR)</option>
              <option value="CDG">パリ (CDG)</option>
              <option value="SIN">シンガポール (SIN)</option>
            </select>
          </div>
        </div>

        {/* 航空会社選択 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            比較したい航空会社 <span className="text-gray-500">(複数選択可)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AIRLINES.map(airline => (
              <label key={airline.code} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchForm.airlines.includes(airline.code as any)}
                  onChange={() => handleAirlineToggle(airline.code as any)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {airline.name}
                  <span className="text-xs text-gray-500 block">{airline.alliance}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* クラス・柔軟性 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">クラス</label>
            <select
              value={searchForm.travelClass}
              onChange={(e) => setSearchForm(prev => ({ ...prev, travelClass: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="economy">エコノミー</option>
              <option value="business">ビジネス</option>
              <option value="first">ファースト</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">日程の柔軟性</label>
            <select
              value={searchForm.flexibility}
              onChange={(e) => setSearchForm(prev => ({ ...prev, flexibility: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="exact">指定日のみ</option>
              <option value="flexible_dates">前後3日</option>
              <option value="flexible_months">月単位で柔軟</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">人数</label>
            <select
              value={searchForm.passengers}
              onChange={(e) => setSearchForm(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num}名</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!searchForm.departure || !searchForm.arrival || searchForm.airlines.length === 0 || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              検索中...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              マイル比較検索
            </>
          )}
        </button>
      </div>

      {/* 検索結果 */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">検索結果 - マイル価値比較</h3>
          
          {searchResults.map((result, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Plane className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">{result.airline}</h4>
                  <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                    空席率: {result.availabilityScore}%
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {result.requiredMiles[searchForm.travelClass].toLocaleString()}マイル
                  </div>
                  <div className="text-sm text-gray-600">
                    現金換算: ¥{result.cashEquivalent.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    1マイル = ¥{result.valuePerMile}相当
                  </div>
                </div>
              </div>

              {/* マイル移行オプション */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">マイル移行オプション</h5>
                <div className="flex flex-wrap gap-2">
                  {result.transferOptions.map((option, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                      {option.creditCard}: {option.transferRatio}
                      {option.bonus > 0 && ` (+${option.bonus}%ボーナス)`}
                    </span>
                  ))}
                </div>
              </div>

              {/* クレジットカード推奨 */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  このルートでお得にマイルを貯めるおすすめクレジットカード
                </h5>
                <div className="grid md:grid-cols-2 gap-3">
                  {getRecommendedCards(result).map((card, cardIdx) => (
                    <a
                      key={cardIdx}
                      href={card.affiliateLink}
                      target="_blank"
                      rel="nofollow noopener"
                      className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-semibold text-gray-800">{card.name}</h6>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>入会ボーナス: {card.signupBonus.toLocaleString()}マイル</div>
                        <div>還元率: {card.mileEarnRate}マイル/100円</div>
                        <div>年会費: ¥{card.annualFee.toLocaleString()}</div>
                      </div>
                      <div className="mt-2 text-xs text-orange-600 font-medium">
                        詳細を見る →
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
