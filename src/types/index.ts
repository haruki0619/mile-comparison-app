// 航空会社の種類
export type Airline = 'ANA' | 'JAL' | 'SOLASEED';

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

// 航空会社のマイル情報
export interface AirlineMileInfo {
  airline: Airline;
  miles: MileRequirement;
  cashPrice?: number;
  bookingStartDays: number; // 予約開始日（搭乗日の何日前）
  availableSeats?: number;
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
  passengers: number;
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
