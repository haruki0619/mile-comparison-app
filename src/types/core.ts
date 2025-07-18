// 基本型定義 - ルート、マイルオプション、座席クラスなど

export interface Route {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
}

// 路線データ（距離情報付き）
export interface RouteData {
  departure: string;
  arrival: string;
  distance?: number; // オプショナルにする
}

// マイルオプション（セーバー/スタンダード/ピーク）
export interface MileOption {
  saver: number;     // セーバーアワード
  standard: number;  // スタンダードアワード  
  peak: number;      // ピーク期間
  availability: 'high' | 'medium' | 'low';
}

// 座席クラス別マイル要件
export interface CabinClassMiles {
  economy: MileOption;
  premium_economy?: MileOption;
  business: MileOption;
  first?: MileOption;
}

// 価格ポイント
export interface PricePoint {
  date: string;
  price: number;
  availability: boolean;
}

// 移行オプション
export interface TransferOption {
  source: string;
  target: string;
  ratio: string;
  fee: number;
  time: string;
}

// 通知設定
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

// 移行プロモーション
export interface TransferPromotion {
  description: string;
  bonusRatio: string; // 例: "25%ボーナス"
  validUntil: string;
  minimumTransfer: number;
}

// 季節性データ
export interface SeasonalityData {
  currentSeason: 'low' | 'shoulder' | 'peak';
  historicalPattern: { month: number; demandLevel: number }[];
  nextSeasonChange: string;
}

// 座席空席状況
export interface SeatAvailability {
  economy: number;
  premium_economy: number;
  business: number;
  first: number;
  lastUpdated: string;
}

// 時間設定
export interface TimePreferences {
  departureTime: 'morning' | 'afternoon' | 'evening' | 'red_eye' | 'any';
  maxFlightTime: number; // 時間
  maxLayoverTime: number; // 時間
  preferredLayoverAirports: string[];
}

// 予算制約
export interface BudgetConstraints {
  maxCashAmount?: number;
  maxMileAmount?: number;
  preferredPaymentMethods: PaymentMethodPreference[];
}

// 支払い方法優先度
export interface PaymentMethodPreference {
  method: 'cash' | 'miles' | 'hybrid' | 'points_transfer';
  priority: number; // 1-10
  constraints?: any;
}
