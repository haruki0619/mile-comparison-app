// メイン型定義のエクスポート - モジュール分割後

// 基本型定義
export * from './core';

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
}
