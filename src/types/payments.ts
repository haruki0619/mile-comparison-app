// 支払い関連の型定義
import { Route, TransferOption, TransferPromotion } from './core';

// 現金支払いオプション
export interface CashPaymentOption {
  airline: string;
  amount: number;
  currency: 'JPY' | 'USD' | 'EUR';
  fareClass: string;
  refundable: boolean;
  changeable: boolean;
  bookingLink: string;
  priceHistory: any[]; // PricePoint[];
  priceAlert: boolean;
}

// マイル支払いオプション  
export interface MilePaymentOption {
  airline: string;
  required: number;
  availability: 'available' | 'waitlist' | 'unavailable';
  bookingClass: string;
  taxes: number;
  valuePerMile: number; // 1マイルあたりの円換算価値
  transferOptions: TransferOption[];
  bookingWindow: string; // 予約可能期間
  cancellationPolicy: string;
  changePolicy: string;
}

// ポイント移行オプション
export interface PointTransferOption {
  creditCardPoints: any[]; // CreditCardTransfer[];
  bankPoints: any[]; // BankPointTransfer[];
  hotelPoints: any[]; // HotelPointTransfer[];
  totalEfficiency: number; // 移行効率スコア
}

// クレジットカード移行
export interface CreditCardTransfer {
  source: 'AMEX_MR' | 'CHASE_UR' | 'CITI_TYP' | 'CAPITAL_ONE' | 'MARRIOTT' | 'SPG';
  pointsRequired: number;
  transferRatio: string; // 例: "1000:1000" or "1000:750"
  transferTime: string;   // 例: "即座" or "1-3営業日"
  transferFee: number;
  targetAirline: string;
  targetMiles: number;
  minimumTransfer: number;
  maximumTransfer: number;
  promotions: TransferPromotion[];
}

// 統合支払方法比較
export interface UnifiedPaymentComparison {
  route: Route;
  travelDate: string;
  passengerCount: number;
  searchTimestamp: string;
  
  paymentOptions: {
    // 現金支払い
    cash: CashPaymentOption[];
    
    // マイル支払い
    miles: { [airline: string]: MilePaymentOption };
    
    // ハイブリッド支払い（マイル+現金）
    hybrid: any[]; // HybridPaymentOption[];
    
    // ポイント移行
    pointTransfer: PointTransferOption[];
  };
  
  // AI推奨システム
  recommendation: any; // PaymentRecommendation;
  
  // 市場分析
  marketAnalysis: any; // MarketAnalysis;
}

// 支払いオプションの詳細
export interface PaymentOption {
  type: 'cash' | 'miles' | 'hybrid' | 'points_transfer';
  details: CashPaymentDetails | MilePaymentDetails | HybridPaymentDetails | PointTransferDetails;
  totalValue: number;
  efficiency: number;
}

export interface CashPaymentDetails {
  refundable: boolean;
  changeable: boolean;
  earnMiles: number;
  estimatedValue: number;
  savings: number;
  taxes: number;
  valuePerMile: number;
}

export interface MilePaymentDetails {
  refundable: boolean;
  changeable: boolean;
  earnMiles: number;
  estimatedValue: number;
  savings: number;
  taxes: number;
  valuePerMile: number;
}

export interface HybridPaymentDetails {
  refundable: boolean;
  changeable: boolean;
  earnMiles: number;
  estimatedValue: number;
  savings: number;
  taxes: number;
  valuePerMile: number;
}

export interface PointTransferDetails {
  refundable: boolean;
  changeable: boolean;
  earnMiles: number;
  transferRatio: number;
  transferTime: string;
  resultingMiles: number;
  savings: number;
}
