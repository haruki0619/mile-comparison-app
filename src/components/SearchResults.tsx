'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult, AirlineMileInfo, SearchForm } from '../types';
import { getAirport, calculateBookingStartDate } from '../utils/mileCalculator';
import MileValueComparison from './MileValueComparison';
import { BookingButtonFromSearchResult } from './BookingButton';
import ComprehensiveMileageComparison from './ComprehensiveMileageComparison';
import { 
  Plane, 
  Calendar, 
  CreditCard, 
  Award, 
  ExternalLink, 
  AlertCircle,
  MapPin
} from 'lucide-react';

interface SearchResultsProps {
  result: SearchResult;
  lastSearchForm?: SearchForm | null;
  onCreateAlert?: (offer: any) => void;
  onViewCalendar?: (searchDate?: string) => void;
}

export default function SearchResults({ result, lastSearchForm, onCreateAlert, onViewCalendar }: SearchResultsProps) {
  console.log('🎯 SearchResults component rendered with:', result);
  
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log('🎯 SearchResults useEffect - result changed:', result);
    
    // 検索結果が更新されたときに自動スクロール
    if (searchResultsRef.current) {
      const scrollTimeout = setTimeout(() => {
        const element = searchResultsRef.current;
        if (element) {
          const headerHeight = 80; // ヘッダーの高さを考慮した余白
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const targetPosition = absoluteElementTop - headerHeight;
          
          // より人間らしいスクロール速度に調整
          const currentPosition = window.pageYOffset;
          const distance = Math.abs(targetPosition - currentPosition);
          const duration = Math.min(1500, Math.max(800, distance * 0.8)); // 800ms〜1500msの間で調整
          
          // カスタムスムーススクロール関数
          const startTime = performance.now();
          const startPosition = currentPosition;
          
          const smoothScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング関数（ease-out）でより自然な動きに
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const newPosition = startPosition + (targetPosition - startPosition) * easeOut;
            
            window.scrollTo(0, newPosition);
            
            if (progress < 1) {
              requestAnimationFrame(smoothScroll);
            }
          };
          
          requestAnimationFrame(smoothScroll);
        }
      }, 200); // 遅延を少し増やしてレンダリング完了を確実に待つ
      
      return () => clearTimeout(scrollTimeout);
    }
    
    // useEffectのクリーンアップ関数なしの場合のreturn undefined
    return undefined;
  }, [result]);
  
  // 国内空港コードリスト（日本の主要空港）
  const domesticAirports = [
    'HND', 'NRT', 'ITM', 'KIX', 'CTS', 'FUK', 'OKA', 'NGO', 'KOJ', 'KMJ',
    'SDJ', 'KMQ', 'HIJ', 'TAK', 'MYJ', 'UBJ', 'AOR', 'MMY', 'ISG', 'AOJ'
  ];
    const isDomesticRoute = result.route && 
                          domesticAirports.includes(result.route.departure) &&
                          domesticAirports.includes(result.route.arrival);

  const departureAirport = result.route ? getAirport(result.route.departure) : null;
  const arrivalAirport = result.route ? getAirport(result.route.arrival) : null;

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
    if (!airlineInfo?.miles) return 0;
    const season = 'season' in result ? result.season : 'regular';
    const seasonMiles = airlineInfo.miles[season as keyof typeof airlineInfo.miles];
    const regularMiles = airlineInfo.miles.regular;
    return seasonMiles || regularMiles || 0;
  };

  // マイル価値を計算（改善版 - 実際の現金価格を使用）
  const getMileValue = (cashPrice: number, miles: number): number => {
    return miles > 0 ? Math.round((cashPrice / miles) * 100) / 100 : 0;
  };

  // マイル価値のステータスを取得
  const getMileValueStatus = (mileValue: number) => {
    if (mileValue >= 2.0) return { status: '優秀', color: 'text-green-600 bg-green-50', icon: '🟢' };
    if (mileValue >= 1.5) return { status: '良好', color: 'text-blue-600 bg-blue-50', icon: '🔵' };
    if (mileValue >= 1.0) return { status: '普通', color: 'text-yellow-600 bg-yellow-50', icon: '🟡' };
    return { status: '注意', color: 'text-red-600 bg-red-50', icon: '🔴' };
  };

  // 支払い方法の推奨を取得
  const getPaymentRecommendation = (mileValue: number) => {
    if (mileValue >= 1.8) return { method: 'マイル特典', color: 'text-green-700', reason: 'マイル価値が高い' };
    if (mileValue < 1.2) return { method: '現金購入', color: 'text-red-700', reason: 'マイル効率が悪い' };
    return { method: 'どちらでも可', color: 'text-blue-700', reason: '価値に大差なし' };
  };

  return (
    <div ref={searchResultsRef} className="space-y-6">
      {/* 🚨 デバッグ: SearchResults レンダリング確認 */}
      <div className="p-4 bg-orange-100 border border-orange-300 rounded text-sm">
        <strong>🚨 SearchResults デバッグ:</strong><br/>
        <span className="text-gray-700">
          コンポーネントがレンダリングされました | 
          航空会社数: {result.airlines?.length || 0} | 
          現在時刻: {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      {/* 検索モード情報表示 */}
      {lastSearchForm && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-900">検索モード:</span>
              <span className="text-indigo-700">
                {lastSearchForm.comparisonMode === 'all' && '全マイレージ制度比較'}
                {lastSearchForm.comparisonMode === 'single' && '選択マイレージ制度'}
                {lastSearchForm.comparisonMode === 'multiple' && '複数マイレージ制度比較'}
              </span>
            </div>
            
            {lastSearchForm.targetMilePrograms && lastSearchForm.targetMilePrograms.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-indigo-600">対象:</span>
                {lastSearchForm.targetMilePrograms.map((program, index) => (
                  <span 
                    key={program} 
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                  >
                    {program}
                  </span>
                ))}
              </div>
            )}
            
            {lastSearchForm.showAllTimeSlots && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-indigo-600">全時間帯表示</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 統合検索結果ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl px-4 sm:px-6 py-6 shadow-lg">
        <div className="flex flex-col gap-4">
          {/* 上部：検索結果タイトルと件数 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">検索結果</h2>
                <p className="text-blue-100 text-sm">
                  {lastSearchForm?.departure || result.route?.departure || 'N/A'} → {lastSearchForm?.arrival || result.route?.arrival || 'N/A'}
                  {lastSearchForm?.date && ` | ${lastSearchForm.date}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">見つかりました</div>
              <div className="text-xl font-bold text-white">{result.airlines?.length || 0}件</div>
            </div>
          </div>
          
          {/* 下部：詳細路線情報とシーズン */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Plane className="w-6 h-6" />
                {departureAirport?.city} ({result.route?.departure || 'N/A'}) → {arrivalAirport?.city} ({result.route?.arrival || 'N/A'})
              </h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getSeasonColor(('season' in result && typeof result.season === 'string') ? result.season : 'regular')}`}>
                  {getSeasonLabel(('season' in result && typeof result.season === 'string') ? result.season : 'regular')}シーズン
                </span>
                <span className="text-blue-100">
                  {result.airlines?.length || 0}社の航空会社が見つかりました
                </span>
              </div>
            </div>
            
            {/* 右側：日付・距離情報 */}
            <div className="flex items-center gap-4 text-blue-100">
              <div className="text-right">
                <div className="text-lg font-medium">{formatDate(('date' in result && typeof result.date === 'string') ? result.date : new Date().toISOString())}</div>
                <div className="text-sm">{'distance' in (result.route || {}) ? (result.route as any).distance : 'N/A'}km</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 航空会社別比較結果 */}
      <div className="grid gap-4">
        {/* マイル価値分析コンポーネント */}
        <MileValueComparison result={result} />
        {result.airlines?.filter(airline => airline && airline.airline && airline.miles).map((airline, index) => (
          <div key={`${airline.airline}-${index}`} className={`bg-white rounded-xl shadow-lg border overflow-hidden ${getAirlineColor(airline.airline)}`}>

            {/* マイル情報バー */}
            <div className="bg-white px-4 sm:px-6 py-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{airline.airline}</h3>
                    {/* フライト詳細情報 */}
                    {(airline as any).flightNumber && (
                      <div className="flex items-center gap-2 mt-1">
                        <Plane className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-600">{(airline as any).flightNumber}</span>
                        {(airline as any).schedule?.departureTime && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {(airline as any).schedule.departureTime}発
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-xl font-bold text-gray-900">
                      {currentMiles(airline).toLocaleString()}
                    </span>
                    <span className="text-gray-600 text-sm">マイル</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-600">マイル価値</div>
                    <div className="text-md font-bold">
                      {(() => {
                        const cashPrice = airline.cashPrice || 0;
                        const mileValue = getMileValue(cashPrice, currentMiles(airline));
                        const status = getMileValueStatus(mileValue);
                        return (
                          <span className={status.color.split(' ')[0]}>
                            {status.icon} {mileValue.toFixed(2)}円/マイル
                          </span>
                        );
                      })()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(() => {
                        const cashPrice = airline.cashPrice || 0;
                        const mileValue = getMileValue(cashPrice, currentMiles(airline));
                        const recommendation = getPaymentRecommendation(mileValue);
                        return (
                          <span className={recommendation.color}>
                            {recommendation.method}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  

                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* マイル情報 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4" />
                    シーズン別マイル
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">オフ:</span>
                      <span className="font-medium">{(airline.miles?.off || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">通常:</span>
                      <span className="font-medium">{(airline.miles?.regular || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ピーク:</span>
                      <span className="font-medium">{(airline.miles?.peak || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 予約情報 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    予約情報
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">受付開始:</span>
                      <span className="font-medium text-xs">
                        {airline.bookingStartDays ? 
                          calculateBookingStartDate(('date' in result && typeof result.date === 'string') ? result.date : new Date().toISOString(), airline.bookingStartDays) 
                          : '未設定'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">現金価格:</span>
                      <span className="font-medium">{airline.cashPrice ? formatCurrency(airline.cashPrice) : '未設定'}</span>
                    </div>
                  </div>
                </div>

                {/* 追加情報 */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4" />
                    詳細
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">空席:</span>
                      <span className="font-medium">{airline.availableSeats || '未設定'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">割引:</span>
                      <span className="font-medium">{airline.discount ? airline.discount.type : 'なし'}</span>
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedAirline(selectedAirline === airline.airline ? null : airline.airline)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    {selectedAirline === airline.airline ? '閉じる' : '予約オプション詳細'}
                  </button>
                  
                  {onCreateAlert && (
                    <button
                      onClick={() => onCreateAlert({
                        airline: airline.airline,
                        route: result.route,
                        miles: currentMiles(airline),
                        date: ('date' in result && typeof result.date === 'string') ? result.date : new Date().toISOString()
                      })}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <AlertCircle className="w-3 h-3" />
                      アラート
                    </button>
                  )}
                </div>
              </div>

              {/* 詳細表示エリア */}
              {selectedAirline === airline.airline && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-4">
                  <h5 className="font-semibold mb-2 text-sm">詳細情報</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <h6 className="font-medium mb-1">特典航空券の特徴</h6>
                      <ul className="text-xs text-gray-600 space-y-0.5">
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

                  {/* 詳細予約オプション */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">詳細予約オプション</h4>
                    
                    {/* デバッグ情報 */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                        <strong>🔧 デバッグ情報:</strong><br/>
                        <span className="text-gray-600">
                          航空会社: {airline.airline} | インデックス: {index} | 
                          マイル: {airline.miles.regular} | 便名: {airline.flightNumber || 'なし'}
                        </span>
                      </div>
                    )}
                    
                    <BookingButtonFromSearchResult
                      result={result}
                      airlineIndex={index}
                      passengers={{ adults: 1 }}
                      onBookingClick={(url, airlineName) => {
                        console.log(`🔧 予約クリック: ${airlineName} -> ${url}`);
                        console.log('🔧 SearchResults - BookingButton clicked!');
                        // アナリティクス等のトラッキング
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 統合マイレージ比較コンポーネント */}
      <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          統合マイレージ比較
        </h3>
        <ComprehensiveMileageComparison 
          defaultRoute={result.route ? {
            departure: result.route.departure,
            arrival: result.route.arrival
          } : undefined}
        />
      </div>

      {/* カレンダー表示ボタン */}
      {onViewCalendar && (
        <div className="text-center">
          <button
            onClick={() => onViewCalendar(('date' in result && typeof result.date === 'string') ? result.date : new Date().toISOString())}
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
