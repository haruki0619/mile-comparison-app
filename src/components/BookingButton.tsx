'use client';

import { useState } from 'react';
import { ExternalLink, Plane, Clock, Users, CreditCard } from 'lucide-react';
import { BookingUrlGenerator, type BookingRequest } from '../utils/bookingUrlGenerator';
import type { SearchResult } from '../types';

interface BookingButtonProps {
  airline: string;
  flightInfo: {
    route: {
      departure: string;
      arrival: string;
    };
    date: string;
    time?: string | undefined;
    flightNumber?: string | undefined;
  };
  passengers: {
    adults: number;
    children?: number | undefined;
    infants?: number | undefined;
  };
  cabinClass: 'economy' | 'premiumEconomy' | 'business' | 'first';
  redemptionType?: 'cash' | 'miles';
  onBookingClick?: ((url: string, airline: string) => void) | undefined;
  className?: string;
}

export default function BookingButton({
  airline,
  flightInfo,
  passengers,
  cabinClass,
  redemptionType = 'cash',
  onBookingClick,
  className = ''
}: BookingButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBookingClick = async () => {
    console.log('🔧 BookingButton clicked!', { airline, redemptionType });
    setIsGenerating(true);
    
    try {
      // 航空会社の検索条件付きURLに直接遷移
      const bookingUrl = getAirlineBookingUrl(airline);
      
      // カスタムコールバック実行（アナリティクス等）
      onBookingClick?.(bookingUrl, airline);
      
      // 新しいタブで航空会社の検索ページを開く
      console.log('🚀 Opening airline booking page:', bookingUrl);
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
      
      // 成功メッセージ
      setTimeout(() => {
        const actionText = redemptionType === 'miles' ? 'マイル特典航空券の予約' : '航空券の予約・購入';
        alert(`${getAirlineName(airline)}の予約ページが開きました。\n${actionText}をお進めください。`);
      }, 500);
      
    } catch (error) {
      console.error('❌ 予約処理エラー:', error);
      alert('予約処理中にエラーが発生しました。航空会社の公式サイトから直接予約してください。');
    } finally {
      setIsGenerating(false);
    }
  };

  // 航空会社コードから表示名を取得（調査済み航空会社）
  const getAirlineName = (code: string): string => {
    const nameMap: Record<string, string> = {
      // 国内航空会社
      'ANA': 'ANA',
      'JAL': 'JAL', 
      'NH': 'ANA',
      'JL': 'JAL',
      'SKY': 'スカイマーク',
      'BC': 'スカイマーク',
      'NU': 'ソラシドエア',
      'MM': 'ピーチ',
      'GK': 'ジェットスター',
      
      // 海外航空会社
      'UNITED': 'ユナイテッド航空',
      'UA': 'ユナイテッド航空',
      'AA': 'アメリカン航空',
      'DELTA': 'デルタ航空',
      'DL': 'デルタ航空',
      'BA': 'ブリティッシュエアウェイズ',
      'SQ': 'シンガポール航空',
      'EK': 'エミレーツ航空',
      'LUFTHANSA': 'ルフトハンザ航空',
      'LH': 'ルフトハンザ航空',
      'CX': 'キャセイパシフィック航空'
    };
    return nameMap[code] || code;
  };

  // 日付をYYYY-MM-DD形式に変換
  const formatDateForUrl = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0]!; // 無効な日付の場合は今日の日付を使用
      }
      return date.toISOString().split('T')[0]!;
    } catch {
      return new Date().toISOString().split('T')[0]!;
    }
  };

  // 空港コードを正規化（航空会社別に異なる場合があります）
  const normalizeAirportCode = (airportCode: string, airlineCode: string): string => {
    // 主要空港のマッピング（必要に応じて拡張）
    const airportMappings: Record<string, Record<string, string>> = {
      // ANA・JAL用の空港コード
      'ANA': {
        '羽田': 'HND',
        '成田': 'NRT',
        '関西': 'KIX',
        '伊丹': 'ITM',
        '新千歳': 'CTS',
        '福岡': 'FUK',
        '那覇': 'OKA',
        '仙台': 'SDJ',
        '小松': 'KMQ',
        '広島': 'HIJ',
        '高松': 'TAK',
        '松山': 'MYJ',
        '鹿児島': 'KOJ',
        '宮崎': 'KMI'
      },
      'JAL': {
        '羽田': 'HND',
        '成田': 'NRT',
        '関西': 'KIX',
        '伊丹': 'ITM',
        '新千歳': 'CTS',
        '福岡': 'FUK',
        '那覇': 'OKA',
        '仙台': 'SDJ',
        '小松': 'KMQ',
        '広島': 'HIJ',
        '高松': 'TAK',
        '松山': 'MYJ',
        '鹿児島': 'KOJ',
        '宮崎': 'KMI'
      }
    };

    const mapping = airportMappings[airlineCode.toUpperCase()];
    if (mapping && mapping[airportCode]) {
      return mapping[airportCode];
    }
    
    // デフォルトは元のコードをそのまま返す
    return airportCode;
  };

  // 航空会社公式サイトの検索条件付きURLを生成
  const getAirlineBookingUrl = (code: string): string => {
    const formattedDate = formatDateForUrl(flightInfo.date);
    const departure = normalizeAirportCode(flightInfo.route.departure, code);
    const arrival = normalizeAirportCode(flightInfo.route.arrival, code);
    const passengerString = `adults=${passengers.adults}${passengers.children ? `&children=${passengers.children}` : ''}${passengers.infants ? `&infants=${passengers.infants}` : ''}`;
    
    console.log('🔧 Building URL for:', { code, formattedDate, departure, arrival, flightNumber: flightInfo.flightNumber });

    switch (code.toUpperCase()) {
      case 'ANA':
      case 'NH':
        // ANA国内線予約システム
        if (redemptionType === 'miles') {
          // マイル特典航空券（simplified URL）
          return `https://www.ana.co.jp/amc/reference/tameru-tsukau/award/domestic/`;
        } else {
          // 通常航空券
          return `https://www.ana.co.jp/ja/jp/book-plan/book/select-flight/input/?i_dom_intl_kbn=1&i_dep_arpt_cd=${departure}&i_arr_arpt_cd=${arrival}&i_dep_dt=${formattedDate}&i_adt_cnt=${passengers.adults}&i_chd_cnt=${passengers.children || 0}&i_inf_cnt=${passengers.infants || 0}`;
        }
        
      case 'JAL':
      case 'JL':
        // JAL国内線予約システム
        if (redemptionType === 'miles') {
          // マイル特典航空券（simplified URL）
          return `https://www.jal.co.jp/jalmile/use/jal/dom/`;
        } else {
          // 通常航空券
          return `https://www.jal.co.jp/jp/ja/dom/search/?depAirportCd=${departure}&arrAirportCd=${arrival}&depDate=${formattedDate}&adultCount=${passengers.adults}&childCount=${passengers.children || 0}&infantCount=${passengers.infants || 0}`;
        }
        
      case 'SKY':
      case 'BC':
        // スカイマーク（一般的なフォーマット）
        return `https://www.skymark.co.jp/ja/reservation/`;
        
      case 'NU':
        // ソラシドエア（一般的なフォーマット）
        return `https://www.solaseedair.jp/reservation/search/`;
        
      case 'MM':
        // ピーチ（一般的なフォーマット）
        return `https://www.flypeach.com/pc/jp/lm/air/search`;
        
      case 'GK':
        // ジェットスター（国際標準フォーマット）
        return `https://www.jetstar.com/jp/ja/booking/select-flight?adults=${passengers.adults}&children=${passengers.children || 0}&infants=${passengers.infants || 0}&origin=${departure}&destination=${arrival}&departureDate=${formattedDate}`;
        
      default:
        // 未対応の航空会社は確実に公式TOPページに遷移（Google検索は使わない）
        const fallbackUrls: Record<string, string> = {
          'UNITED': 'https://www.united.com/jp/ja',
          'UA': 'https://www.united.com/jp/ja',
          'AA': 'https://www.americanairlines.jp/',
          'DELTA': 'https://ja.delta.com/',
          'DL': 'https://ja.delta.com/',
          'BA': 'https://www.britishairways.com/travel/home/public/ja_jp',
          'SQ': 'https://www.singaporeair.com/ja_JP/',
          'EK': 'https://www.emirates.com/jp/japanese/',
          'LUFTHANSA': 'https://www.lufthansa.com/jp/ja/homepage',
          'LH': 'https://www.lufthansa.com/jp/ja/homepage',
          'CX': 'https://www.cathaypacific.com/cx/ja_JP.html'
        };
        
        return fallbackUrls[code.toUpperCase()] || 'https://www.ana.co.jp/'; // 最終フォールバックはANA
    }
  };

  // 座席クラス表示名
  const getClassDisplayName = (classType: string): string => {
    const classMap: Record<string, string> = {
      'economy': 'エコノミー',
      'premiumEconomy': 'プレミアムエコノミー',
      'business': 'ビジネス',
      'first': 'ファースト'
    };
    return classMap[classType] || classType;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* デバッグ情報（開発環境のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
          <strong>🔧 BookingButton デバッグ情報:</strong><br/>
          <div className="mt-1 text-gray-600 space-y-1">
            <div><strong>予約URL:</strong><br/><code className="text-blue-600 text-xs break-all">{getAirlineBookingUrl(airline)}</code></div>
            <div><strong>航空会社:</strong> {airline} ({getAirlineName(airline)})</div>
            <div><strong>ルート:</strong> {flightInfo.route.departure} → {flightInfo.route.arrival}</div>
            <div><strong>正規化後:</strong> {normalizeAirportCode(flightInfo.route.departure, airline)} → {normalizeAirportCode(flightInfo.route.arrival, airline)}</div>
            <div><strong>日付:</strong> {flightInfo.date} (フォーマット後: {formatDateForUrl(flightInfo.date)})</div>
            <div><strong>乗客:</strong> 大人{passengers.adults}名{passengers.children ? ` 子供${passengers.children}名` : ''}{passengers.infants ? ` 幼児${passengers.infants}名` : ''}</div>
            <div><strong>予約タイプ:</strong> {redemptionType === 'miles' ? 'マイル特典' : '現金購入'}</div>
          </div>
        </div>
      )}

      {/* 予約情報サマリー */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">
            {getAirlineName(airline)} 公式サイトで予約
          </h3>
          {redemptionType === 'miles' && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              マイル特典
            </span>
          )}
        </div>
        
        {/* フライト詳細 */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Plane className="w-4 h-4" />
            <span>{flightInfo.route.departure} → {flightInfo.route.arrival}</span>
          </div>
          {flightInfo.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{flightInfo.time}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              大人{passengers.adults}名
              {passengers.children && ` 子供${passengers.children}名`}
              {passengers.infants && ` 幼児${passengers.infants}名`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span>{getClassDisplayName(cabinClass)}</span>
          </div>
        </div>
      </div>

      {/* 予約ボタン */}
      <button
        onClick={handleBookingClick}
        disabled={isGenerating}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
          font-semibold text-white transition-all duration-200
          ${redemptionType === 'miles' 
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
        `}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>準備中...</span>
          </>
        ) : (
          <>
            <ExternalLink className="w-5 h-5" />
            <span>
              {getAirlineName(airline)}公式サイトで{redemptionType === 'miles' ? 'マイル予約' : '予約・購入'}
            </span>
          </>
        )}
      </button>

      {/* 注意事項 */}
      <div className="mt-3 text-xs text-gray-500">
        <p>• {getAirlineName(airline)}の予約ページに直接遷移します</p>
        <p>• 検索条件（日付・空港・人数）が自動入力される場合があります</p>
        <p>• 最新の価格や空席状況は公式サイトでご確認ください</p>
        {redemptionType === 'miles' && (
          <p>• マイル特典航空券には会員ログインが必要です</p>
        )}
      </div>
    </div>
  );
}

// 検索結果コンポーネント用のラッパー
export function BookingButtonFromSearchResult({
  result,
  airlineIndex,
  passengers,
  onBookingClick
}: {
  result: SearchResult;
  airlineIndex: number;
  passengers: { adults: number; children?: number; infants?: number };
  onBookingClick?: (url: string, airline: string) => void;
}) {
  const airline = result.airlines?.[airlineIndex];
  
  if (!airline) {
    return null;
  }
  
  console.log('🔧 BookingButtonFromSearchResult rendered:', {
    hasAirline: !!airline,
    airlineData: airline ? {
      name: airline.airline,
      milesRegular: airline.miles.regular,
      flightNumber: airline.flightNumber
    } : null,
    airlineIndex,
    totalAirlines: result.airlines?.length || 0
  });
  
  if (!airline) {
    console.warn('❌ BookingButtonFromSearchResult: airline not found!', {
      airlineIndex,
      totalAirlines: result.airlines?.length || 0,
      availableAirlines: result.airlines?.map((a, i) => ({ index: i, name: a.airline })) || []
    });
    return (
      <div className="p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
        ⚠️ 航空会社データが見つかりません (インデックス: {airlineIndex})
      </div>
    );
  }

  // 統一予約URLを生成（航空会社のTOPページに遷移）
  // 🚀 将来的な収益化検討: booking.com等のOTAに遷移させることで収益化可能
  // 注意点: OTAではマイル特典航空券の予約は不可のため、明記が必要
  const getUnifiedBookingUrl = (airlineCode: string): string => {
    // 現在は公式サイトに遷移（Google検索回避）
    const urlMap: Record<string, string> = {
      'ANA': 'https://www.ana.co.jp/',
      'NH': 'https://www.ana.co.jp/',
      'JAL': 'https://www.jal.co.jp/',
      'JL': 'https://www.jal.co.jp/',
      'SKY': 'https://www.skymark.co.jp/',
      'BC': 'https://www.skymark.co.jp/',
      'NU': 'https://www.solaseedair.jp/',
      'MM': 'https://www.flypeach.com/jp',
      'GK': 'https://www.jetstar.com/jp/ja/home',
      // 海外航空会社
      'UNITED': 'https://www.united.com/jp/ja',
      'UA': 'https://www.united.com/jp/ja',
      'AA': 'https://www.americanairlines.jp/',
      'DELTA': 'https://ja.delta.com/',
      'DL': 'https://ja.delta.com/',
      'BA': 'https://www.britishairways.com/travel/home/public/ja_jp',
      'SQ': 'https://www.singaporeair.com/ja_JP/',
      'EK': 'https://www.emirates.com/jp/japanese/',
      'LUFTHANSA': 'https://www.lufthansa.com/jp/ja/homepage',
      'LH': 'https://www.lufthansa.com/jp/ja/homepage',
      'CX': 'https://www.cathaypacific.com/cx/ja_JP.html'
    };
    
    // 🚀 将来的な実装例（収益化検討時）:
    // const otaUrls = {
    //   'booking.com': `https://www.booking.com/flights/search?departure=${departure}&arrival=${arrival}&date=${date}`,
    //   'expedia.jp': `https://www.expedia.co.jp/flights/search?from=${departure}&to=${arrival}&date=${date}`,
    //   'skyscanner.jp': `https://www.skyscanner.jp/flights/${departure}/${arrival}/${date}`
    // };
    // 注意: OTAではマイル特典航空券の予約は不可
    
    return urlMap[airlineCode.toUpperCase()] || 'https://www.ana.co.jp/'; // フォールバック
  };

  return (
    <div className="space-y-3">
      {/* デバッグ情報（開発環境のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 bg-blue-100 border border-blue-300 rounded text-xs">
          <strong>🔧 BookingButton デバッグ:</strong><br/>
          <span className="text-gray-600">
            航空会社: {airline.airline} | 
            出発地: {result.route?.departure || 'N/A'} | 
            到着地: {result.route?.arrival || 'N/A'} | 
            日付: {'date' in result ? result.date : 'N/A'} | 
            マイル: {airline.miles.regular}
          </span>
        </div>
      )}
      
      {/* 統一予約ボタン */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            {airline.airline}で確認・予約
          </h3>
        </div>
        
        {/* 統一予約ボタン */}
        <button
          onClick={() => {
            const bookingUrl = getUnifiedBookingUrl(airline.airline);
            onBookingClick?.(bookingUrl, airline.airline);
            window.open(bookingUrl, '_blank', 'noopener,noreferrer');
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <ExternalLink className="w-5 h-5" />
          <span>{airline.airline}公式サイトで確認・予約</span>
        </button>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>• 公式サイトで最新の価格・空席状況をご確認ください</p>
          <p>• 現金購入・マイル特典航空券のどちらも予約可能です</p>
        </div>
      </div>
    </div>
  );
}
