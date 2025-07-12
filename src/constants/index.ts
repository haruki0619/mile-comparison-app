import { Airport, MileProgram } from '../types';

// 日本の主要空港リスト
export const AIRPORTS: Airport[] = [
  { code: 'HND', name: '羽田空港', city: '東京' },
  { code: 'NRT', name: '成田国際空港', city: '東京' },
  { code: 'KIX', name: '関西国際空港', city: '大阪' },
  { code: 'ITM', name: '大阪国際空港（伊丹）', city: '大阪' },
  { code: 'NGO', name: '中部国際空港', city: '名古屋' },
  { code: 'CTS', name: '新千歳空港', city: '札幌' },
  { code: 'FUK', name: '福岡空港', city: '福岡' },
  { code: 'OKA', name: '那覇空港', city: '沖縄' },
  { code: 'SDJ', name: '仙台空港', city: '仙台' },
  { code: 'HIJ', name: '広島空港', city: '広島' },
  { code: 'KMJ', name: '熊本空港', city: '熊本' },
  { code: 'KOJ', name: '鹿児島空港', city: '鹿児島' },
  { code: 'GAJ', name: '山形空港', city: '山形' }
];

// マイルプログラム定義
export const MILE_PROGRAMS: MileProgram[] = [
  { 
    name: 'ANA', 
    transferRatio: 1, 
    redemptionValue: 1.5,
    description: 'ANAマイレージクラブ'
  },
  { 
    name: 'JAL', 
    transferRatio: 1, 
    redemptionValue: 1.5,
    description: 'JALマイレージバンク'
  },
  { 
    name: 'ソラシドエア', 
    transferRatio: 1, 
    redemptionValue: 1.2,
    description: 'ソラシドエアマイレージクラブ'
  }
];

// 人数選択オプション
export const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// タブタイプ
export type TabType = 'search' | 'calendar' | 'alerts' | 'calculator';

export const TABS = [
  { id: 'search', label: '検索・比較', icon: 'Plane' },
  { id: 'calendar', label: '価格カレンダー', icon: 'Calendar' },
  { id: 'alerts', label: '価格アラート', icon: 'Bell' },
  { id: 'calculator', label: '価値計算機', icon: 'Calculator' }
] as const;
