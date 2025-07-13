'use client';

import { useState, useEffect } from 'react';
import { SearchResult, AirlineMileInfo } from '../types';
import { getAirport, calculateBookingStartDate } from '../utils/mileCalculator';
import { 
  Plane, 
  Calendar, 
  CreditCard, 
  Award, 
  ExternalLink, 
  Info, 
  TrendingDown,
  AlertCircle,
  Calculator
} from 'lucide-react';

interface SearchResultsProps {
  result: SearchResult;
  onCreateAlert?: (offer: any) => void;
  onViewCalendar?: (searchDate?: string) => void;
}

export default function SearchResults({ result, onCreateAlert, onViewCalendar }: SearchResultsProps) {
  console.log('🎯 SearchResults component rendered with:', result);
  
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const [showPatternComparison, setShowPatternComparison] = useState(true);
  const [showEfficiencyCalculator, setShowEfficiencyCalculator] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(true);
  const [showDynamicComparison, setShowDynamicComparison] = useState(false);
  
  useEffect(() => {
    console.log('🎯 SearchResults useEffect - result changed:', result);
  }, [result]);
  
  const departureAirport = getAirport(result.route.departure);
  const arrivalAirport = getAirport(result.route.arrival);

  console.log('🎯 Airport data:', { departureAirport, arrivalAirport });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const getSeasonLabel = (season: string) => {
    switch (season) {
      case 'peak': return 'ピーク';
      case 'off': return 'オフピーク';
      default: return 'レギュラー';
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'peak': return 'text-red-600 bg-red-50';
      case 'off': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getAirlineColor = (airline: string) => {
    switch (airline) {
      case 'ANA': return 'border-blue-200 bg-blue-50';
      case 'JAL': return 'border-red-200 bg-red-50';
      case 'SOLASEED': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  // 現在のシーズンのマイル数を取得
  const currentMiles = (airlineInfo: AirlineMileInfo) => {
    return airlineInfo.miles[result.season];
  };

  // マイル価値を計算（簡易版）
  const getMileValue = (miles: number) => {
    return miles * 2; // 1マイル = 2円として計算
  };

  return (
    <div className="space-y-8">
      {/* 検索結果ヘッダー */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Main Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Plane className="w-6 h-6" />
            検索結果
          </h2>
          <div className="flex items-center gap-4 text-blue-100 text-sm mt-2">
            <div className="font-medium">
              {departureAirport?.city} ({result.route.departure})
            </div>
            <div className="text-blue-200">→</div>
            <div className="font-medium">
              {arrivalAirport?.city} ({result.route.arrival})
            </div>
            <div className="text-blue-200">|</div>
            <div>{formatDate(result.date)}</div>
            <div className="text-blue-200">|</div>
            <div>{result.route.distance}km</div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getSeasonColor(result.season)}`}>
                {getSeasonLabel(result.season)}シーズン
              </span>
              <span className="text-sm text-gray-600">
                {result.airlines.length}社の航空会社が見つかりました
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowPatternComparison(!showPatternComparison)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showPatternComparison 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <TrendingDown className="w-3 h-3 mr-1 inline" />
                パターン比較
              </button>
              
              <button
                onClick={() => setShowEfficiencyCalculator(!showEfficiencyCalculator)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showEfficiencyCalculator 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Calculator className="w-3 h-3 mr-1 inline" />
                効率計算
              </button>

              <button
                onClick={() => setShowDynamicComparison(!showDynamicComparison)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showDynamicComparison 
                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Info className="w-3 h-3 mr-1 inline" />
                動的比較
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* アップデート通知プレースホルダー */}
      {showUpdateAlert && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">🔔 マイル規約更新通知</h3>
          <p className="text-yellow-700">マイル規約の変更があった場合、こちらに通知が表示されます。</p>
          <button 
            onClick={() => setShowUpdateAlert(false)}
            className="mt-3 px-4 py-2 bg-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            閉じる
          </button>
        </div>
      )}

      {/* 動的マイル比較プレースホルダー */}
      {showDynamicComparison && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">⚡ 動的マイル比較</h3>
          <p className="text-purple-700">リアルタイムでマイル数の変動を追跡し、最適なタイミングを提案します。</p>
        </div>
      )}

      {/* マイル効率計算ツールプレースホルダー */}
      {showEfficiencyCalculator && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-green-800 mb-4">🧮 マイル効率計算ツール</h3>
          <p className="text-green-700">現金購入とマイル使用の効率を比較し、最適な支払い方法を提案します。</p>
        </div>
      )}

      {/* 航空会社別比較結果 */}
      <div className="grid gap-6">
        {result.airlines.map((airline, index) => (
          <div key={airline.airline || index} className={`bg-white rounded-xl shadow-lg border overflow-hidden ${getAirlineColor(airline.airline)}`}>
            {/* 航空会社ヘッダー */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900">{airline.airline}</h3>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">
                      {currentMiles(airline).toLocaleString()}
                    </span>
                    <span className="text-gray-600">マイル</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">マイル価値</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(getMileValue(currentMiles(airline)))}
                    </div>
                  </div>
                  
                  <a
                    href="#"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    予約
                  </a>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* マイル情報 */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    シーズン別マイル
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">オフピーク:</span>
                      <span className="font-medium">{airline.miles.off.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">レギュラー:</span>
                      <span className="font-medium">{airline.miles.regular.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ピーク:</span>
                      <span className="font-medium">{airline.miles.peak.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 予約情報 */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    予約情報
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">受付開始:</span>
                      <span className="font-medium">
                        {calculateBookingStartDate(result.date, airline.bookingStartDays)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">現金価格:</span>
                      <span className="font-medium">{airline.cashPrice ? formatCurrency(airline.cashPrice) : '未設定'}</span>
                    </div>
                  </div>
                </div>

                {/* 追加情報 */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    その他
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">空席数:</span>
                      <span className="font-medium">{airline.availableSeats || '未設定'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">割引:</span>
                      <span className="font-medium">{airline.discount ? airline.discount.type : 'なし'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedAirline(selectedAirline === airline.airline ? null : airline.airline)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  {selectedAirline === airline.airline ? '詳細を閉じる' : '詳細を見る'}
                </button>
                
                {onCreateAlert && (
                  <button
                    onClick={() => onCreateAlert({
                      airline: airline.airline,
                      route: result.route,
                      miles: currentMiles(airline),
                      date: result.date
                    })}
                    className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    アラート作成
                  </button>
                )}
              </div>

              {/* 詳細表示エリア */}
              {selectedAirline === airline.airline && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold mb-3">詳細情報</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-medium mb-2">特典航空券の特徴</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 燃油サーチャージ: 別途必要</li>
                        <li>• 座席クラス: エコノミー</li>
                        <li>• 乗り継ぎ: 最大1回</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium mb-2">注意事項</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 空席状況により取得できない場合があります</li>
                        <li>• 変更・取消には手数料が発生します</li>
                        <li>• マイル有効期限にご注意ください</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* パターン比較プレースホルダー */}
      {showPatternComparison && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 マイルパターン比較</h3>
          <p className="text-gray-600">このセクションでは、異なる日程でのマイル数変動を比較できます。</p>
        </div>
      )}

      {/* カレンダー表示ボタン */}
      {onViewCalendar && (
        <div className="text-center">
          <button
            onClick={() => onViewCalendar(result.date)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Calendar className="w-5 h-5" />
            カレンダーで他の日程を確認
          </button>
        </div>
      )}
    </div>
  );
}
