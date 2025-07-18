// 分析・監視関連の型定義
import { Route, NotificationSettings, SeatAvailability, SeasonalityData } from './core';
import { PaymentOption } from './payments';

// AI推奨システム
export interface PaymentRecommendation {
  bestValue: {
    option: PaymentOption;
    reasoning: string;
    savings: number;
    savingsPercentage: number;
  };
  
  alternatives: {
    fastest: PaymentOption;
    mostFlexible: PaymentOption;
    lowestRisk: PaymentOption;
  };
  
  riskFactors: RiskFactor[];
  marketTiming: TimingAdvice;
}

export interface RiskFactor {
  type: 'availability' | 'price_volatility' | 'transfer_risk' | 'booking_window';
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

export interface TimingAdvice {
  currentTiming: 'optimal' | 'good' | 'poor';
  bestBookingWindow: string;
  priceDirection: 'rising' | 'falling' | 'stable';
  confidence: number; // 0-100%
}

// リアルタイム監視システム
export interface RealTimeMonitoring {
  priceAlerts: any[]; // PriceAlert[];
  availabilityAlerts: any[]; // AvailabilityAlert[];
  bookingWindowAlerts: any[]; // BookingWindowAlert[];
  transferPromotionAlerts: any[]; // TransferPromotionAlert[];
}

export interface PriceAlert {
  id: string;
  route: Route;
  targetPrice: number;
  currentPrice: number;
  priceHistory: any[]; // PricePoint[];
  predictedTrend: 'rising' | 'falling' | 'stable';
  confidence: number;
  alertTrigger: 'below_target' | 'significant_drop' | 'trend_change';
  notifications: NotificationSettings;
}

export interface AvailabilityAlert {
  id: string;
  route: Route;
  targetDates: string[];
  cabinClass: string;
  currentAvailability: { [airline: string]: SeatAvailability };
  waitlistPosition?: number;
  estimatedWaitTime?: string;
  notifications: NotificationSettings;
}

// 価値分析エンジン
export interface ValueAnalysisEngine {
  mileValueCalculator: { [airline: string]: MileValueMetrics };
  redemptionAnalysis: RedemptionAnalysis;
  historicalData: HistoricalAnalysis;
  competitiveAnalysis: CompetitiveAnalysis;
}

export interface MileValueMetrics {
  averageValue: number;    // 1マイルの平均価値（円）
  bestCaseValue: number;   // 最高価値（ファーストクラス国際線等）
  worstCaseValue: number;  // 最低価値（国内線エコノミー等）
  volatility: number;      // 価値の変動性 (0-1)
  liquidity: number;       // 利用しやすさ (0-1)
  transferability: number; // 他社移行可能性 (0-1)
  expirationRisk: number;  // 有効期限リスク (0-1)
}

export interface RedemptionAnalysis {
  route: Route;
  options: RedemptionOption[];
  marketComparison: MarketComparison;
  timing: TimingAnalysis;
}

export interface RedemptionOption {
  paymentMethod: string;
  totalCost: number;
  mileValue: number;
  roi: number;              // 投資対効果
  opportunityCost: number;  // 機会費用
  recommendationScore: number; // 推奨度スコア (0-100)
  pros: string[];
  cons: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface MarketAnalysis {
  competitorPrices: { [source: string]: number };
  marketPosition: 'below_market' | 'at_market' | 'above_market';
  seasonality: SeasonalityData;
  demandLevel: 'low' | 'medium' | 'high';
}

export interface MarketComparison {
  competitorAnalysis: { [competitor: string]: CompetitorData };
  marketPosition: 'leader' | 'competitive' | 'behind';
  differentiators: string[];
}

export interface CompetitorData {
  pricing: number;
  availability: boolean;
  features: string[];
  lastUpdated: string;
}

export interface TimingAnalysis {
  bestBookingPeriod: string;
  seasonalTrends: SeasonalityData;
  demandForecast: DemandForecast;
  priceHistory: any[]; // PricePoint[];
}

export interface DemandForecast {
  nextMonth: 'low' | 'medium' | 'high';
  nextQuarter: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
}

export interface HistoricalAnalysis {
  priceHistory: any[]; // PricePoint[];
  availabilityHistory: AvailabilityHistory[];
  seasonalPatterns: SeasonalityData;
  volatilityMetrics: VolatilityMetrics;
}

export interface AvailabilityHistory {
  date: string;
  availability: { [cabinClass: string]: number };
  bookingClass: string;
}

export interface VolatilityMetrics {
  priceVolatility: number;
  availabilityVolatility: number;
  seasonalVariation: number;
  unpredictabilityScore: number;
}

export interface CompetitiveAnalysis {
  marketLeaders: string[];
  competitiveAdvantages: { [airline: string]: string[] };
  weaknesses: { [airline: string]: string[] };
  marketShare: { [airline: string]: number };
  customerSatisfaction: { [airline: string]: number };
}
