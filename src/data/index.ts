import { Airport, Route, MileRequirement, SeasonPeriod } from '../types';
import { internationalAirports, internationalRoutes } from './internationalMiles';

// 全空港データ（国内線+国際線）
export const airports: Airport[] = [
  // 関東
  { code: 'HND', name: '羽田空港', city: '東京' },
  { code: 'NRT', name: '成田国際空港', city: '東京' },
  
  // 中部
  { code: 'NGO', name: '中部国際空港', city: '名古屋' },
  { code: 'KMQ', name: '小松空港', city: '小松' },
  { code: 'TOY', name: '富山空港', city: '富山' },
  
  // 関西
  { code: 'ITM', name: '大阪国際空港（伊丹）', city: '大阪' },
  { code: 'KIX', name: '関西国際空港', city: '大阪' },
  { code: 'UKB', name: '神戸空港', city: '神戸' },
  
  // 北海道
  { code: 'CTS', name: '新千歳空港', city: '札幌' },
  { code: 'AKJ', name: '旭川空港', city: '旭川' },
  { code: 'HKD', name: '函館空港', city: '函館' },
  { code: 'OBO', name: '帯広空港', city: '帯広' },
  { code: 'KUH', name: '釧路空港', city: '釧路' },
  { code: 'MMB', name: '女満別空港', city: '網走' },
  
  // 東北
  { code: 'SDJ', name: '仙台国際空港', city: '仙台' },
  { code: 'AOJ', name: '青森空港', city: '青森' },
  { code: 'AXT', name: '秋田空港', city: '秋田' },
  { code: 'GAJ', name: '山形空港', city: '山形' },
  { code: 'FKS', name: '福島空港', city: '福島' },
  { code: 'MSJ', name: '三沢空港', city: '三沢' },
  { code: 'HNA', name: '花巻空港', city: '花巻' },
  
  // 関東・甲信越
  { code: 'FSZ', name: '富士山静岡空港', city: '静岡' },
  { code: 'MMJ', name: '松本空港', city: '松本' },
  
  // 中国・四国
  { code: 'HIJ', name: '広島空港', city: '広島' },
  { code: 'OKJ', name: '岡山空港', city: '岡山' },
  { code: 'UBJ', name: '宇部空港', city: '宇部' },
  { code: 'IWJ', name: '岩国空港', city: '岩国' },
  { code: 'YGO', name: '米子空港', city: '米子' },
  { code: 'TTJ', name: '鳥取空港', city: '鳥取' },
  { code: 'MYJ', name: '松山空港', city: '松山' },
  { code: 'TAK', name: '高松空港', city: '高松' },
  { code: 'KCZ', name: '高知空港', city: '高知' },
  { code: 'TKS', name: '徳島空港', city: '徳島' },
  
  // 九州
  { code: 'FUK', name: '福岡空港', city: '福岡' },
  { code: 'KTN', name: '北九州空港', city: '北九州' },
  { code: 'HSG', name: '佐賀空港', city: '佐賀' },
  { code: 'NGS', name: '長崎空港', city: '長崎' },
  { code: 'KMJ', name: '熊本空港', city: '熊本' },
  { code: 'OIT', name: '大分空港', city: '大分' },
  { code: 'MYZ', name: '宮崎空港', city: '宮崎' },
  { code: 'KOJ', name: '鹿児島空港', city: '鹿児島' },
  { code: 'TNE', name: '種子島空港', city: '種子島' },
  { code: 'ASJ', name: '奄美空港', city: '奄美' },
  
  // 沖縄
  { code: 'OKA', name: '那覇空港', city: '沖縄' },
  { code: 'ISG', name: '石垣空港', city: '石垣' },
  { code: 'MMY', name: '宮古空港', city: '宮古' },
  { code: 'DNA', name: '与那国空港', city: '与那国' },
  
  // 国際線空港（主要都市）
  ...internationalAirports.map(airport => ({
    code: airport.code,
    name: airport.name,
    city: airport.city,
    region: airport.region
  })),
];

// 国内線路線データ（距離は概算値）
export const routes: Route[] = [
  // 羽田発の主要路線
  { departure: 'HND', arrival: 'CTS', distance: 830 },
  { departure: 'HND', arrival: 'FUK', distance: 880 },
  { departure: 'HND', arrival: 'OKA', distance: 1550 },
  { departure: 'HND', arrival: 'ITM', distance: 280 },
  { departure: 'HND', arrival: 'NGO', distance: 280 },
  { departure: 'HND', arrival: 'SDJ', distance: 320 },
  { departure: 'HND', arrival: 'HIJ', distance: 650 },
  { departure: 'HND', arrival: 'KMJ', distance: 920 },
  { departure: 'HND', arrival: 'KOJ', distance: 960 },
  { departure: 'HND', arrival: 'MYJ', distance: 570 },
  { departure: 'HND', arrival: 'TAK', distance: 550 },
  { departure: 'HND', arrival: 'KCZ', distance: 600 },
  { departure: 'HND', arrival: 'AOJ', distance: 640 },
  { departure: 'HND', arrival: 'AXT', distance: 450 },
  { departure: 'HND', arrival: 'OKJ', distance: 580 },
  { departure: 'HND', arrival: 'MYZ', distance: 1000 },
  { departure: 'HND', arrival: 'OIT', distance: 750 },
  { departure: 'HND', arrival: 'HKD', distance: 630 },
  { departure: 'HND', arrival: 'AKJ', distance: 900 },
  { departure: 'HND', arrival: 'KMQ', distance: 350 },
  { departure: 'HND', arrival: 'TOY', distance: 380 },
  { departure: 'HND', arrival: 'FSZ', distance: 180 },
  { departure: 'HND', arrival: 'MMJ', distance: 220 },

  // 成田発の主要路線
  { departure: 'NRT', arrival: 'CTS', distance: 830 },
  { departure: 'NRT', arrival: 'FUK', distance: 880 },
  { departure: 'NRT', arrival: 'OKA', distance: 1550 },
  { departure: 'NRT', arrival: 'ITM', distance: 430 },
  { departure: 'NRT', arrival: 'NGO', distance: 280 },
  { departure: 'NRT', arrival: 'MYJ', distance: 570 },
  { departure: 'NRT', arrival: 'KOJ', distance: 960 },

  // 伊丹発の路線
  { departure: 'ITM', arrival: 'CTS', distance: 1050 },
  { departure: 'ITM', arrival: 'FUK', distance: 470 },
  { departure: 'ITM', arrival: 'OKA', distance: 1200 },
  { departure: 'ITM', arrival: 'KMJ', distance: 560 },
  { departure: 'ITM', arrival: 'KOJ', distance: 630 },
  { departure: 'ITM', arrival: 'MYJ', distance: 250 },
  { departure: 'ITM', arrival: 'TAK', distance: 150 },
  { departure: 'ITM', arrival: 'KCZ', distance: 200 },
  { departure: 'ITM', arrival: 'AOJ', distance: 900 },
  { departure: 'ITM', arrival: 'SDJ', distance: 630 },
  { departure: 'ITM', arrival: 'AXT', distance: 720 },
  { departure: 'ITM', arrival: 'OIT', distance: 300 },
  { departure: 'ITM', arrival: 'MYZ', distance: 480 },

  // 関空発の路線
  { departure: 'KIX', arrival: 'CTS', distance: 1100 },
  { departure: 'KIX', arrival: 'FUK', distance: 500 },
  { departure: 'KIX', arrival: 'OKA', distance: 1200 },
  { departure: 'KIX', arrival: 'MYJ', distance: 280 },
  { departure: 'KIX', arrival: 'KOJ', distance: 650 },

  // 中部発の路線
  { departure: 'NGO', arrival: 'CTS', distance: 750 },
  { departure: 'NGO', arrival: 'FUK', distance: 680 },
  { departure: 'NGO', arrival: 'OKA', distance: 1350 },
  { departure: 'NGO', arrival: 'SDJ', distance: 500 },
  { departure: 'NGO', arrival: 'KOJ', distance: 800 },
  { departure: 'NGO', arrival: 'MYJ', distance: 500 },
  { departure: 'NGO', arrival: 'KMJ', distance: 720 },

  // 福岡発の九州内路線
  { departure: 'FUK', arrival: 'KMJ', distance: 120 },
  { departure: 'FUK', arrival: 'KOJ', distance: 180 },
  { departure: 'FUK', arrival: 'OIT', distance: 140 },
  { departure: 'FUK', arrival: 'MYZ', distance: 200 },
  { departure: 'FUK', arrival: 'NGS', distance: 150 },
  { departure: 'FUK', arrival: 'OKA', distance: 850 },

  // 沖縄内路線
  { departure: 'OKA', arrival: 'ISG', distance: 410 },
  { departure: 'OKA', arrival: 'MMY', distance: 290 },
  { departure: 'ISG', arrival: 'DNA', distance: 120 },

  // 北海道内路線
  { departure: 'CTS', arrival: 'HKD', distance: 250 },
  { departure: 'CTS', arrival: 'AKJ', distance: 140 },
  { departure: 'CTS', arrival: 'OBO', distance: 200 },
  { departure: 'CTS', arrival: 'KUH', distance: 280 },
  { departure: 'CTS', arrival: 'MMB', distance: 350 },

  // 地方空港間の路線
  { departure: 'MYJ', arrival: 'FUK', distance: 280 },
  { departure: 'MYJ', arrival: 'KOJ', distance: 380 },
  { departure: 'TAK', arrival: 'FUK', distance: 300 },
  { departure: 'KCZ', arrival: 'FUK', distance: 350 },
  { departure: 'OKJ', arrival: 'FUK', distance: 250 },
  { departure: 'HIJ', arrival: 'FUK', distance: 200 },
  
  // 東北地方の路線
  { departure: 'SDJ', arrival: 'CTS', distance: 550 },
  { departure: 'SDJ', arrival: 'FUK', distance: 950 },
  { departure: 'AOJ', arrival: 'CTS', distance: 300 },
  { departure: 'AXT', arrival: 'CTS', distance: 450 },
  
  // 国際線路線
  ...internationalRoutes,
];

// ANAのマイル要件テーブル（2024-2025年最新チャート）
export const anaMileChart: { [key: string]: MileRequirement } = {
  // 東京-大阪（280km）: 7,000/8,500/10,500マイル
  '0-300': { off: 7000, regular: 8500, peak: 10500 },
  // 東京-福岡・札幌（880km, 830km）: 8,000/9,500/12,000マイル  
  '301-600': { off: 8000, regular: 9500, peak: 12000 },
  '601-900': { off: 8000, regular: 9500, peak: 12000 },
  // 東京-沖縄・大阪-沖縄（1550km）: 9,500/10,500/13,000マイル
  '901-1600': { off: 9500, regular: 10500, peak: 13000 },
  '1601+': { off: 9500, regular: 10500, peak: 13000 },
};

// JALのマイル要件テーブル（2024-2025年最新チャート）
// JALは全ての国内線で通年5,500マイル（ゾーン制・シーズン区分なし）
export const jalMileChart: { [key: string]: MileRequirement } = {
  '0-300': { off: 5500, regular: 5500, peak: 5500 },
  '301-600': { off: 5500, regular: 5500, peak: 5500 },
  '601-900': { off: 5500, regular: 5500, peak: 5500 },
  '901-1600': { off: 5500, regular: 5500, peak: 5500 },
  '1601+': { off: 5500, regular: 5500, peak: 5500 },
};

// ソラシドエアのマイル要件テーブル - 実際の価格データに基づき調整
export const solaseedMileChart: { [key: string]: MileRequirement } = {
  '0-300': { regular: 12000, peak: 14000, off: 10000 },   // 調整: 5000→12000 (マイル価値約1.9円)
  '301-600': { regular: 15000, peak: 18000, off: 12000 }, // 調整: 10000→15000
  '601-800': { regular: 18000, peak: 22000, off: 15000 }, // 調整: 14000→18000
  '801-1000': { regular: 20000, peak: 24000, off: 17000 }, // 調整: 16000→20000
  '1001+': { regular: 18000, peak: 21000, off: 15000 },   // 維持（適正な価値）
};

// ANAシーズン分類（2025年の公式チャート）
export const seasonPeriods: SeasonPeriod[] = [
  // ピークシーズン
  { start: '2025-01-01', end: '2025-01-08', type: 'peak' },
  { start: '2025-03-14', end: '2025-04-02', type: 'peak' },
  { start: '2025-04-24', end: '2025-05-12', type: 'peak' },
  { start: '2025-07-18', end: '2025-08-24', type: 'peak' },
  { start: '2025-12-25', end: '2025-12-31', type: 'peak' },
  
  // オフシーズン  
  { start: '2025-01-09', end: '2025-02-28', type: 'off' },
  { start: '2025-04-03', end: '2025-04-23', type: 'off' },
  { start: '2025-12-01', end: '2025-12-24', type: 'off' },
  
  // レギュラーシーズン（その他の期間）
  { start: '2025-03-01', end: '2025-03-13', type: 'regular' },
  { start: '2025-05-13', end: '2025-07-17', type: 'regular' },
  { start: '2025-08-25', end: '2025-11-30', type: 'regular' },
];

// 距離に基づくマイル区分を取得（実際のANA/JALチャートに対応）
export function getDistanceCategory(distance: number): string {
  if (distance <= 300) return '0-300';
  if (distance <= 600) return '301-600';
  if (distance <= 900) return '601-900';
  if (distance <= 1600) return '901-1600';
  return '1601+';
}

// ソラシドエア用の距離区分
export function getSolaseedDistanceCategory(distance: number): string {
  if (distance <= 300) return '0-300';
  if (distance <= 600) return '301-600';
  if (distance <= 800) return '601-800';
  if (distance <= 1000) return '801-1000';
  return '1001+';
}

// 日付からシーズンを判定
export function getSeason(date: string): 'regular' | 'peak' | 'off' {
  const targetDate = new Date(date);
  
  for (const period of seasonPeriods) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    
    if (targetDate >= start && targetDate <= end) {
      return period.type;
    }
  }
  
  return 'regular';
}
