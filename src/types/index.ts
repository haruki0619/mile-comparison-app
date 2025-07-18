// メイン型定義のエクスポート - モジュール分割後

// 基本型定義
export * from './core';
import { RouteData } from './core';

// 航空会社別型定義
export * from './airlines';

// 支払い関連型定義
export * from './payments';

// 分析・監視型定義
export * from './analytics';

// API関連型定義
export * from './api';

// 既存の型定義（後方互換性のため残す）
export type Airline = 'ANA' | 'JAL' | 'SOLASEED' | 'スカイマーク' | 'ピーチ' | 'ジェットスター' | 'バニラエア' | 'Peach' | 'Jetstar' | 'Vanilla' | 'Spring';

export interface Airport {
  code: string;
  name: string;
  city: string;
  region?: string;
}

export interface MileRequirement {
  regular: number;
  discount?: number;
  off?: number;
  peak?: number;
}

// SearchForm型を追加
export interface SearchForm {
  departure: string;
  arrival: string;
  date: string;
  passengers: number;
  mileageProgram?: string;
  targetMilePrograms?: string[];
  comparisonMode?: string;
  showAllTimeSlots?: boolean;
  returnDate?: string;
}

// SearchResult型を追加
export interface SearchResult {
  flights: any[];
  total: number;
  route?: RouteData;
  airlines?: any[];
  date?: string;
  season?: string;
}

// AirlineMileInfo型を追加
export interface AirlineMileInfo {
  airline: string;
  miles: {
    regular: number;
    peak?: number;
    off?: number;
    discount?: number;
  };
  cashPrice?: number;
  bookingStartDays?: number;
  fuelSurcharge?: number;
  discount?: any;
  availableSeats?: number;
  url?: string;
  availabilityStatus?: string;
}

// MileProgram型を追加
export interface MileProgram {
  name: string;
  alliance?: string;
  transferRatio: number;
  redemptionValue: number;
  description: string;
}

// Mile chart type definitions for foreign airlines
export interface UnitedMileChart {
  alliance?: string;
  partners?: string[];
  currency?: string;
  domestic?: any;
  international?: any;
  [route: string]: any;
}

export interface AmericanMileChart {
  [route: string]: any;
}

export interface SingaporeMileChart {
  [route: string]: any;
}

export interface GlobalMileChart {
  [airline: string]: {
    [route: string]: MileRequirement;
  };
}
