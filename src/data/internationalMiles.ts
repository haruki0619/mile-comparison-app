import { MileRequirement } from '../types';

// 国際線空港データ
export const internationalAirports = [
  // 北米
  { code: 'LAX', name: 'ロサンゼルス国際空港', city: 'ロサンゼルス', country: 'アメリカ', region: 'North America' },
  { code: 'JFK', name: 'ジョン・F・ケネディ国際空港', city: 'ニューヨーク', country: 'アメリカ', region: 'North America' },
  { code: 'SFO', name: 'サンフランシスコ国際空港', city: 'サンフランシスコ', country: 'アメリカ', region: 'North America' },
  { code: 'YVR', name: 'バンクーバー国際空港', city: 'バンクーバー', country: 'カナダ', region: 'North America' },
  
  // ヨーロッパ
  { code: 'LHR', name: 'ヒースロー空港', city: 'ロンドン', country: 'イギリス', region: 'Europe' },
  { code: 'CDG', name: 'シャルル・ド・ゴール空港', city: 'パリ', country: 'フランス', region: 'Europe' },
  { code: 'FRA', name: 'フランクフルト空港', city: 'フランクフルト', country: 'ドイツ', region: 'Europe' },
  { code: 'AMS', name: 'アムステルダム・スキポール空港', city: 'アムステルダム', country: 'オランダ', region: 'Europe' },
  
  // アジア
  { code: 'ICN', name: '仁川国際空港', city: 'ソウル', country: '韓国', region: 'Asia' },
  { code: 'TPE', name: '台湾桃園国際空港', city: '台北', country: '台湾', region: 'Asia' },
  { code: 'HKG', name: '香港国際空港', city: '香港', country: '香港', region: 'Asia' },
  { code: 'SIN', name: 'チャンギ国際空港', city: 'シンガポール', country: 'シンガポール', region: 'Asia' },
  { code: 'BKK', name: 'スワンナプーム国際空港', city: 'バンコク', country: 'タイ', region: 'Asia' },
  { code: 'KUL', name: 'クアラルンプール国際空港', city: 'クアラルンプール', country: 'マレーシア', region: 'Asia' },
  { code: 'MNL', name: 'ニノイ・アキノ国際空港', city: 'マニラ', country: 'フィリピン', region: 'Asia' },
  
  // オセアニア
  { code: 'SYD', name: 'シドニー国際空港', city: 'シドニー', country: 'オーストラリア', region: 'Oceania' },
  { code: 'MEL', name: 'メルボルン空港', city: 'メルボルン', country: 'オーストラリア', region: 'Oceania' },
];

// 国際線路線データ（距離は概算値）
export const internationalRoutes = [
  // 北米路線
  { departure: 'NRT', arrival: 'LAX', distance: 8770 },
  { departure: 'HND', arrival: 'LAX', distance: 8770 },
  { departure: 'NRT', arrival: 'JFK', distance: 10870 },
  { departure: 'HND', arrival: 'JFK', distance: 10870 },
  { departure: 'NRT', arrival: 'SFO', distance: 8280 },
  
  // ヨーロッパ路線
  { departure: 'NRT', arrival: 'LHR', distance: 9590 },
  { departure: 'HND', arrival: 'LHR', distance: 9590 },
  { departure: 'NRT', arrival: 'CDG', distance: 9700 },
  { departure: 'HND', arrival: 'CDG', distance: 9700 },
  { departure: 'NRT', arrival: 'FRA', distance: 9370 },
  
  // アジア路線
  { departure: 'NRT', arrival: 'ICN', distance: 1160 },
  { departure: 'HND', arrival: 'ICN', distance: 1160 },
  { departure: 'KIX', arrival: 'ICN', distance: 870 },
  { departure: 'NRT', arrival: 'TPE', distance: 2100 },
  { departure: 'HND', arrival: 'TPE', distance: 2100 },
  { departure: 'NRT', arrival: 'HKG', distance: 2960 },
  { departure: 'HND', arrival: 'HKG', distance: 2960 },
  { departure: 'NRT', arrival: 'SIN', distance: 5300 },
  { departure: 'HND', arrival: 'SIN', distance: 5300 },
  { departure: 'NRT', arrival: 'BKK', distance: 4580 },
  { departure: 'HND', arrival: 'BKK', distance: 4580 },
  
  // オセアニア路線
  { departure: 'NRT', arrival: 'SYD', distance: 7820 },
  { departure: 'HND', arrival: 'SYD', distance: 7820 },
];

// ANA国際線マイルチャート（2025年最新・往復エコノミー）
export const anaInternationalMileChart: { [key: string]: MileRequirement } = {
  // 韓国（Zone 2）
  'Korea': { off: 12000, regular: 15000, peak: 24000 },
  
  // 東アジア（Zone 3）- 台湾・香港
  'East_Asia': { off: 17000, regular: 20000, peak: 30000 },
  
  // 東南アジア（Zone 4）- タイ・シンガポール・マレーシア
  'Southeast_Asia': { off: 30000, regular: 35000, peak: 50000 },
  
  // 北米（Zone 6）
  'North_America': { off: 40000, regular: 50000, peak: 72000 },
  
  // ヨーロッパ（Zone 7）
  'Europe': { off: 45000, regular: 55000, peak: 78000 },
  
  // オセアニア（Zone 5）
  'Oceania': { off: 35000, regular: 40000, peak: 58000 },
};

// JAL国際線マイルチャート（2025年最新・往復エコノミー）
// JALはAward Ticket PLUSシステムで変動制、ここはベース最低マイル
export const jalInternationalMileChart: { [key: string]: MileRequirement } = {
  // 韓国
  'Korea': { off: 15000, regular: 15000, peak: 15000 },
  
  // 東アジア - 台湾・香港
  'East_Asia_Taiwan': { off: 18000, regular: 18000, peak: 18000 },
  'East_Asia_HongKong': { off: 22000, regular: 22000, peak: 22000 },
  
  // 東南アジア - タイ・シンガポール
  'Southeast_Asia_Thailand': { off: 27000, regular: 27000, peak: 27000 },
  'Southeast_Asia_Singapore': { off: 26000, regular: 26000, peak: 26000 },
  
  // 北米
  'North_America': { off: 54000, regular: 54000, peak: 54000 },
  
  // ヨーロッパ
  'Europe': { off: 54000, regular: 54000, peak: 54000 },
  
  // オセアニア
  'Oceania': { off: 40000, regular: 40000, peak: 40000 },
};

// 燃油サーチャージ（2025年8-9月の目安・往復）
export const fuelSurcharge = {
  ANA: {
    'Korea': 4400,
    'East_Asia': 12200,
    'Southeast_Asia': 22000,
    'North_America': 46200,
    'Europe': 46200,
    'Oceania': 30000,
  },
  JAL: {
    'Korea': 7000,
    'East_Asia_Taiwan': 17000,
    'East_Asia_HongKong': 17000,
    'Southeast_Asia_Thailand': 36000,
    'Southeast_Asia_Singapore': 36000,
    'North_America': 66000,
    'Europe': 66000,
    'Oceania': 50000,
  }
};

// その他の航空会社（LCC含む）
export const otherAirlinesMileChart: { [airline: string]: { [key: string]: MileRequirement } } = {
  // United Airlines (UA) - Star Alliance Partner
  // UAマイレージプラスでANA国内線を取得する場合
  'United': {
    '0-300': { off: 5000, regular: 6000, peak: 8000 },     // 短距離路線（東京-大阪など）
    '301-600': { off: 6000, regular: 7500, peak: 10000 },  // 中距離路線（東京-福岡など）
    '601-900': { off: 6000, regular: 7500, peak: 10000 },  // 中距離路線
    '901-1600': { off: 8000, regular: 10000, peak: 12000 }, // 長距離路線（東京-沖縄など）
    '1601+': { off: 8000, regular: 10000, peak: 12000 },
  },
  
  // Peach Aviation
  'Peach': {
    '0-300': { off: 6000, regular: 8000, peak: 10000 },
    '301-600': { off: 8000, regular: 10000, peak: 12000 },
    '601-900': { off: 10000, regular: 12000, peak: 15000 },
    '901-1600': { off: 12000, regular: 15000, peak: 18000 },
    '1601+': { off: 15000, regular: 18000, peak: 22000 },
  },
  
  // Jetstar Japan
  'Jetstar': {
    '0-300': { off: 7000, regular: 9000, peak: 11000 },
    '301-600': { off: 9000, regular: 11000, peak: 13000 },
    '601-900': { off: 11000, regular: 13000, peak: 16000 },
    '901-1600': { off: 13000, regular: 16000, peak: 19000 },
    '1601+': { off: 16000, regular: 19000, peak: 23000 },
  },
  
  // Vanilla Air (バニラエア)
  'Vanilla': {
    '0-300': { off: 6500, regular: 8500, peak: 10500 },
    '301-600': { off: 8500, regular: 10500, peak: 12500 },
    '601-900': { off: 10500, regular: 12500, peak: 15500 },
    '901-1600': { off: 12500, regular: 15500, peak: 18500 },
    '1601+': { off: 15500, regular: 18500, peak: 22500 },
  },
  
  // Spring Japan
  'Spring': {
    '0-300': { off: 7500, regular: 9500, peak: 11500 },
    '301-600': { off: 9500, regular: 11500, peak: 13500 },
    '601-900': { off: 11500, regular: 13500, peak: 16500 },
    '901-1600': { off: 13500, regular: 16500, peak: 19500 },
    '1601+': { off: 16500, regular: 19500, peak: 23500 },
  },
};

// ゾーン判定関数
export function getInternationalZone(departureCode: string, arrivalCode: string): string {
  const route = internationalRoutes.find(r => 
    (r.departure === departureCode && r.arrival === arrivalCode) ||
    (r.departure === arrivalCode && r.arrival === departureCode)
  );
  
  if (!route) return 'Unknown';
  
  const airport = internationalAirports.find(a => 
    a.code === arrivalCode || a.code === departureCode
  );
  
  if (!airport) return 'Unknown';
  
  // 特定の空港コードに基づく詳細ゾーン判定
  switch (airport.code) {
    case 'ICN':
      return 'Korea';
    case 'TPE':
      return 'East_Asia_Taiwan';
    case 'HKG':
      return 'East_Asia_HongKong';
    case 'BKK':
      return 'Southeast_Asia_Thailand';
    case 'SIN':
    case 'KUL':
      return 'Southeast_Asia_Singapore';
    case 'LAX':
    case 'JFK':
    case 'SFO':
    case 'YVR':
      return 'North_America';
    case 'LHR':
    case 'CDG':
    case 'FRA':
    case 'AMS':
      return 'Europe';
    case 'SYD':
    case 'MEL':
      return 'Oceania';
    default:
      // 地域ベースのフォールバック
      switch (airport.region) {
        case 'Asia':
          if (route.distance < 2000) return 'East_Asia';
          return 'Southeast_Asia';
        case 'North America':
          return 'North_America';
        case 'Europe':
          return 'Europe';
        case 'Oceania':
          return 'Oceania';
        default:
          return 'Unknown';
      }
  }
}

// 国際線マイル取得関数
export function getInternationalMiles(
  airline: string, 
  departureCode: string, 
  arrivalCode: string, 
  season: 'off' | 'regular' | 'peak'
): MileRequirement | null {
  const zone = getInternationalZone(departureCode, arrivalCode);
  
  if (zone === 'Unknown') return null;
  
  if (airline === 'ANA' && anaInternationalMileChart[zone]) {
    return anaInternationalMileChart[zone];
  }
  
  if (airline === 'JAL' && jalInternationalMileChart[zone]) {
    return jalInternationalMileChart[zone];
  }
  
  return null;
}

// 燃油サーチャージ取得関数
export function getFuelSurcharge(
  airline: string,
  departureCode: string, 
  arrivalCode: string
): number {
  const zone = getInternationalZone(departureCode, arrivalCode);
  
  if (zone === 'Unknown') return 0;
  
  if (airline === 'ANA' && fuelSurcharge.ANA[zone as keyof typeof fuelSurcharge.ANA]) {
    return fuelSurcharge.ANA[zone as keyof typeof fuelSurcharge.ANA];
  }
  
  if (airline === 'JAL') {
    // JALの詳細ゾーンマッピング
    const jalZone = zone.startsWith('East_Asia') ? zone : 
                   zone.startsWith('Southeast_Asia') ? zone : zone;
    if (fuelSurcharge.JAL[jalZone as keyof typeof fuelSurcharge.JAL]) {
      return fuelSurcharge.JAL[jalZone as keyof typeof fuelSurcharge.JAL];
    }
  }
  
  return 0;
}
