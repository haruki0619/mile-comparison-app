// 航空会社の種類（国際線と他社を追加）
export type Airline = 'ANA' | 'JAL' | 'SOLASEED' | 'スカイマーク' | 'ピーチ' | 'ジェットスター' | 'バニラエア' | 'Peach' | 'Jetstar' | 'Vanilla' | 'Spring';

// 空港情報
export interface Airport {
  code: string;
  name: string;
  city: string;
  region?: string; // 地域分類（関東、関西、北海道など）
}

// 路線情報
export interface Route {
  departure: string;
  arrival: string;
  distance: number;
}

// マイル要件（シーズン別）
export interface MileRequirement {
  regular: number;
  peak: number;
  off: number;
}

// マイル価値情報
export interface MileValueInfo {
  hasMileProgram: boolean;
  baselineMileValue: number; // 基準価値（円/マイル）
  specificMileValue: number; // この特典での価値（円/マイル）
  interpretation: string;    // 価値の解釈
  recommendation: string;    // 推奨アクション
}

// 航空会社のマイル情報
export interface AirlineMileInfo {
  airline: Airline;
  flightNumber?: string; // 便名（例: NH123）
  schedule?: {
    departureTime: string; // 出発時刻（例: 08:30）
    arrivalTime: string;   // 到着時刻（例: 10:00）
    duration?: string;     // 飛行時間（例: 1:30）
  };
  miles: MileRequirement;
  cashPrice?: number;
  bookingStartDays: number; // 予約開始日（搭乗日の何日前）
  availableSeats?: number;
  fuelSurcharge?: number; // 燃油サーチャージ（国際線）
  mileValueInfo?: MileValueInfo; // マイル価値分析情報
  discount?: {
    type: 'tokutabi' | 'timesale' | 'campaign';
    discountedMiles: number;
    validUntil: string;
  };
}

// 検索フォームの入力
export interface SearchForm {
  departure: string;
  arrival: string;
  date: string;
  returnDate?: string; // 復路日付（往復の場合）
  passengers: number;
  class?: 'ECONOMY' | 'BUSINESS' | 'FIRST'; // キャビンクラス
  // マイル比較機能の拡張
  targetMilePrograms?: string[]; // 複数のマイルプログラムを選択可能
  showAllTimeSlots?: boolean;    // 同じ航空会社の複数便を表示
  comparisonMode?: 'single' | 'multiple' | 'all'; // 比較モード
}

// 検索結果
export interface SearchResult {
  route: Route;
  date: string;
  airlines: AirlineMileInfo[];
  season: 'regular' | 'peak' | 'off';
}

// シーズン分類
export interface SeasonPeriod {
  start: string;
  end: string;
  type: 'regular' | 'peak' | 'off';
}

// 価格アラート
export interface PriceAlert {
  id: string;
  route: string;
  targetPrice: number;
  currentPrice: number;
  email: string;
  isActive: boolean;
}

// マイルプログラム
export interface MileProgram {
  name: string;
  transferRatio: number;
  redemptionValue: number;
  description: string;
}

// 計算結果
export interface CalculationResult {
  mileAmount: number;
  cashAmount: number;
  program: string;
  mileValue: number;
  valuePerMile: number;
  savings: number;
  savingsPercentage: number;
  recommendation: string;
  recommendationColor: string;
}
