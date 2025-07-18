// メインデータのエクスポート - モジュール分割後

// 空港データ
import airports from './airports.json';
export { airports };

// 距離データ
import distances from './distances.json';
export { distances };

// 外国航空会社データ
export * from './foreignAirlines';

// グローバルマイルデータ
export * from './globalMiles';

// 国際線マイルデータ
export * from './internationalMiles';

// 新規追加: 国内線専用データ
export * from './domesticMiles';

// 季節判定関数（仮の実装）
export const getSeason = (date: string): 'regular' | 'peak' | 'off' => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  
  // 簡単な季節判定ロジック
  if (month >= 7 && month <= 8) return 'peak'; // 夏季
  if (month >= 12 || month <= 1) return 'peak'; // 年末年始
  if (month >= 3 && month <= 5) return 'peak'; // 春
  
  return 'regular';
};

// mileCalculator.tsで必要なデータを追加エクスポート
// 配列形式のルートデータ
export const routes = [
  { departure: 'HND', arrival: 'CTS', distance: 820 },
  { departure: 'HND', arrival: 'FUK', distance: 880 },
  { departure: 'HND', arrival: 'OKA', distance: 1570 },
  { departure: 'NRT', arrival: 'CTS', distance: 840 },
  { departure: 'NRT', arrival: 'FUK', distance: 900 },
  { departure: 'KIX', arrival: 'CTS', distance: 1100 },
  { departure: 'KIX', arrival: 'OKA', distance: 1200 },
  // 必要に応じて追加
];

export const anaMileChart = {
  zone1: { regular: 5000, peak: 6000 },
  zone2: { regular: 7000, peak: 8500 },
  zone3: { regular: 10000, peak: 12000 },
  zone4: { regular: 15000, peak: 18000 },
};

export const jalMileChart = {
  zone1: { regular: 6000, peak: 7500 },
  zone2: { regular: 10000, peak: 12000 },
  zone3: { regular: 15000, peak: 18000 },
  zone4: { regular: 20000, peak: 24000 },
};

export const solaseedMileChart = {
  zone1: { regular: 5000, peak: 6000 },
  zone2: { regular: 8000, peak: 10000 },
};

// 距離カテゴリ判定関数
export const getDistanceCategory = (distance: number): string => {
  if (distance <= 600) return 'zone1';
  if (distance <= 1200) return 'zone2';
  if (distance <= 2000) return 'zone3';
  return 'zone4';
};

export const getSolaseedDistanceCategory = (distance: number): string => {
  if (distance <= 800) return 'zone1';
  return 'zone2';
};
