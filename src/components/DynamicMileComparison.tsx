'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Award, 
  TrendingDown, 
  Star, 
  Calendar,
  AlertCircle,
  Zap,
  Target
} from 'lucide-react';
import { mileChartManager } from '../services/mileChartManager';

interface DynamicMileComparisonProps {
  onBestOptionFound?: (option: any) => void;
}

export default function DynamicMileComparison({ onBestOptionFound }: DynamicMileComparisonProps) {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelClass, setTravelClass] = useState('economy');
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // 人気目的地のプリセット（国内線を優先）
  const popularDestinations = [
    '大阪', '沖縄', '札幌', '福岡', '名古屋',
    'ホノルル', 'ソウル', '台北', '香港', 'シンガポール'
  ];

  const travelClasses = [
    { value: 'economy', label: 'エコノミー' },
    { value: 'business', label: 'ビジネス' },
    { value: 'first', label: 'ファースト' }
  ];

  const handleSearch = () => {
    if (!destination) return;
    
    setIsLoading(true);
    setShowComparison(true);

    // シミュレート検索（実際はAPIまたはmileChartManagerを使用）
    setTimeout(() => {
      const results = mileChartManager.findBestMileOption(destination, travelDate, travelClass);
      setComparisonResults(results);
      
      const bestResult = results.length > 0 ? results[0] : null;
      if (bestResult?.isBest) {
        onBestOptionFound?.(bestResult);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const bestOption = useMemo(() => {
    return comparisonResults.find(r => r.isBest);
  }, [comparisonResults]);

  const savingsAmount = useMemo(() => {
    if (comparisonResults.length < 2) return 0;
    const sorted = comparisonResults.sort((a, b) => a.miles - b.miles);
    return sorted[sorted.length - 1].miles - sorted[0].miles;
  }, [comparisonResults]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">動的マイル比較</h3>
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
          最新データ対応
        </span>
      </div>

      {/* 検索フォーム */}
      <div className="space-y-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目的地
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="例: ホノルル、ロサンゼルス"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {popularDestinations.map(dest => (
                <button
                  key={dest}
                  onClick={() => setDestination(dest)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出発日（任意）
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              クラス
            </label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {travelClasses.map(cls => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex justify-end items-end">
            <button
              onClick={handleSearch}
              disabled={!destination || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  検索中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  比較検索
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 比較結果 */}
      {showComparison && (
        <div className="space-y-4">
          {/* ベストオプションのハイライト */}
          {bestOption && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-800">最安値発見！</h4>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  最大{savingsAmount.toLocaleString()}マイル節約
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">航空会社</div>
                  <div className="text-xl font-bold text-gray-800">{bestOption.airline}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">必要マイル</div>
                  <div className="text-xl font-bold text-green-600">
                    {bestOption.miles.toLocaleString()} マイル
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">シーズン</div>
                  <div className="text-xl font-bold text-blue-600">
                    {bestOption.season === 'low' ? 'オフピーク' : 
                     bestOption.season === 'high' ? 'ピーク' : 'レギュラー'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 詳細比較表 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">
                    航空会社
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                    必要マイル
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                    シーズン
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                    評価
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonResults.map((result, index) => (
                  <tr 
                    key={`${result.airline}-${index}`}
                    className={result.isBest ? 'bg-green-50' : 'hover:bg-gray-50'}
                  >
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.airline}</span>
                        {result.isBest && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            最安
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <span className={`font-bold ${result.isBest ? 'text-green-600' : 'text-gray-800'}`}>
                        {result.miles.toLocaleString()}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.season === 'low' ? 'bg-blue-100 text-blue-700' :
                        result.season === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {result.season === 'low' ? 'オフピーク' : 
                         result.season === 'high' ? 'ピーク' : 'レギュラー'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {result.isBest ? (
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">ベスト</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">
                            +{(result.miles - bestOption.miles).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 最新情報の注意書き */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">最新データに基づく比較</h4>
                <p className="text-sm text-blue-700">
                  この比較結果は2025年6月のマイル表改定後の最新データに基づいています。
                  実際の予約時は各航空会社の公式サイトで最新の必要マイル数をご確認ください。
                </p>
                {travelDate && (
                  <p className="text-sm text-blue-700 mt-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    出発日: {formatDate(travelDate)} のシーズン判定を適用
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
