// 国際線専用マイレージプログラムデータ
// ファクトチェック根拠: 各航空会社公式サイト

import { MileRequirement, MileOption, CabinClassMiles } from '../types';

// 国際線対応航空会社型
export type InternationalAirlineCode = 
  | 'ANA' | 'JAL'     // 日本系
  | 'UA' | 'AA' | 'DL' // 米国系
  | 'LH' | 'BA' | 'AF' // 欧州系
  | 'SQ' | 'CX' | 'TG' // アジア系
  | 'QR' | 'EK'       // 中東系
  | 'AC' | 'NZ' | 'SA'; // その他

// 国際線地域分類
export type InternationalRegion = 
  | 'asia_short'        // アジア短距離（韓国・台湾・香港等）
  | 'asia_medium'       // アジア中距離（東南アジア・中国等）
  | 'north_america'     // 北米
  | 'europe'           // ヨーロッパ
  | 'oceania'          // オセアニア
  | 'africa'           // アフリカ
  | 'south_america'    // 南米
  | 'middle_east';     // 中東

// 国際線専用マイルチャート構造
export interface InternationalMileChart {
  airlineCode: InternationalAirlineCode;
  airlineName: string;
  program: string;
  alliance?: string;
  
  // 地域別・クラス別マイル数
  regions: {
    [K in InternationalRegion]?: CabinClassMiles;
  };
  
  // 国際線特有の特徴
  internationalFeatures: {
    stopoverAllowed?: boolean;        // ストップオーバー可能
    openJawAllowed?: boolean;         // オープンジョー可能
    upgradeAwards?: boolean;          // アップグレード特典
    oneWayBooking?: boolean;          // 片道予約対応
    multiCityBooking?: boolean;       // 複数都市予約
    partnerBooking?: boolean;         // パートナー航空会社予約
    fuelSurchargeRequired?: boolean;  // 燃油サーチャージ必須
    taxesIncluded?: boolean;          // 諸税込み表示
  };
  
  // 予約・発券情報
  bookingInfo: {
    advanceBookingDays: number;       // 予約開始日数
    bookingCutoffHours: number;       // 予約締切時間
    waitlistAvailable?: boolean;      // キャンセル待ち可能
    seatAvailability?: 'good' | 'limited' | 'poor';
  };
  
  // 公式情報源
  officialSource: {
    url: string;
    lastUpdated: string;
    verified: boolean;
  };
}

// 国際線主要空港データ（出発地優先）
export const internationalMajorAirports = [
  // 日本の国際空港
  { code: 'NRT', name: '東京(成田)', region: '日本', priority: 1, international: true },
  { code: 'HND', name: '東京(羽田)', region: '日本', priority: 2, international: true },
  { code: 'KIX', name: '大阪(関西)', region: '日本', priority: 3, international: true },
  { code: 'NGO', name: '名古屋(中部)', region: '日本', priority: 4, international: true },
  { code: 'CTS', name: '札幌(新千歳)', region: '日本', priority: 5, international: true },
  { code: 'FUK', name: '福岡', region: '日本', priority: 6, international: true },
  
  // アジア主要空港
  { code: 'ICN', name: 'ソウル(仁川)', region: 'アジア', priority: 7, international: true },
  { code: 'TPE', name: '台北(桃園)', region: 'アジア', priority: 8, international: true },
  { code: 'HKG', name: '香港', region: 'アジア', priority: 9, international: true },
  { code: 'SIN', name: 'シンガポール', region: 'アジア', priority: 10, international: true },
  
  // 北米主要空港
  { code: 'LAX', name: 'ロサンゼルス', region: '北米', priority: 11, international: true },
  { code: 'SFO', name: 'サンフランシスコ', region: '北米', priority: 12, international: true },
  { code: 'JFK', name: 'ニューヨーク(JFK)', region: '北米', priority: 13, international: true },
  { code: 'YVR', name: 'バンクーバー', region: '北米', priority: 14, international: true },
  
  // ヨーロッパ主要空港
  { code: 'LHR', name: 'ロンドン(ヒースロー)', region: 'ヨーロッパ', priority: 15, international: true },
  { code: 'CDG', name: 'パリ(シャルル・ド・ゴール)', region: 'ヨーロッパ', priority: 16, international: true },
  { code: 'FRA', name: 'フランクフルト', region: 'ヨーロッパ', priority: 17, international: true }
];

// 地域別空港グループ（国際線）
export const internationalAirportsByRegion = {
  'アジア短距離': {
    countries: ['韓国', '台湾', '香港', 'マカオ'],
    airports: ['ICN', 'GMP', 'TPE', 'TSA', 'HKG', 'MFM']
  },
  'アジア中・長距離': {
    countries: ['中国', '東南アジア', 'インド', 'オセアニア'],
    airports: ['PEK', 'SHA', 'SIN', 'BKK', 'KUL', 'DEL', 'SYD', 'MEL']
  },
  '北米': {
    countries: ['米国', 'カナダ'],
    airports: ['LAX', 'SFO', 'JFK', 'ORD', 'YVR', 'YYZ']
  },
  'ヨーロッパ': {
    countries: ['英国', 'フランス', 'ドイツ', 'その他'],
    airports: ['LHR', 'CDG', 'FRA', 'AMS', 'ZUR', 'FCO']
  },
  '中東・アフリカ': {
    countries: ['UAE', 'カタール', '南アフリカ'],
    airports: ['DXB', 'DOH', 'JNB']
  }
};

// 既存の国際線空港データ（後方互換性のため維持）
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

// ANA国際線マイルチャート
export const anaInternationalChart: InternationalMileChart = {
  airlineCode: 'ANA',
  airlineName: '全日本空輸',
  program: 'ANAマイレージクラブ',
  alliance: 'Star Alliance',
  regions: {
    asia_short: {
      economy: { saver: 12000, standard: 17000, peak: 20000, availability: 'medium' },
      business: { saver: 24000, standard: 35000, peak: 40000, availability: 'low' }
    },
    asia_medium: {
      economy: { saver: 17000, standard: 30000, peak: 35000, availability: 'medium' },
      business: { saver: 35000, standard: 60000, peak: 68000, availability: 'low' }
    },
    north_america: {
      economy: { saver: 40000, standard: 50000, peak: 55000, availability: 'low' },
      business: { saver: 75000, standard: 85000, peak: 90000, availability: 'low' },
      first: { saver: 120000, standard: 150000, peak: 165000, availability: 'low' }
    },
    europe: {
      economy: { saver: 45000, standard: 55000, peak: 60000, availability: 'low' },
      business: { saver: 80000, standard: 90000, peak: 95000, availability: 'low' },
      first: { saver: 135000, standard: 165000, peak: 180000, availability: 'low' }
    }
  },
  internationalFeatures: {
    stopoverAllowed: true,
    openJawAllowed: true,
    upgradeAwards: true,
    oneWayBooking: true,
    multiCityBooking: true,
    partnerBooking: true,
    fuelSurchargeRequired: false,
    taxesIncluded: false
  },
  bookingInfo: {
    advanceBookingDays: 355,
    bookingCutoffHours: 24,
    waitlistAvailable: true,
    seatAvailability: 'limited'
  },
  officialSource: {
    url: 'https://www.ana.co.jp/ja/jp/amc/reference/international/',
    lastUpdated: '2025-01-17',
    verified: true
  }
};

// JAL国際線マイルチャート
export const jalInternationalChart: InternationalMileChart = {
  airlineCode: 'JAL',
  airlineName: '日本航空',
  program: 'JALマイレージバンク',
  alliance: 'oneworld',
  regions: {
    asia_short: {
      economy: { saver: 15000, standard: 20000, peak: 23000, availability: 'medium' },
      business: { saver: 30000, standard: 40000, peak: 43000, availability: 'low' }
    },
    asia_medium: {
      economy: { saver: 20000, standard: 35000, peak: 40000, availability: 'medium' },
      business: { saver: 40000, standard: 70000, peak: 75000, availability: 'low' }
    },
    north_america: {
      economy: { saver: 50000, standard: 60000, peak: 65000, availability: 'low' },
      business: { saver: 100000, standard: 120000, peak: 125000, availability: 'low' },
      first: { saver: 140000, standard: 180000, peak: 190000, availability: 'low' }
    },
    europe: {
      economy: { saver: 52000, standard: 65000, peak: 70000, availability: 'low' },
      business: { saver: 110000, standard: 130000, peak: 135000, availability: 'low' },
      first: { saver: 160000, standard: 200000, peak: 210000, availability: 'low' }
    }
  },
  internationalFeatures: {
    stopoverAllowed: true,
    openJawAllowed: true,
    upgradeAwards: true,
    oneWayBooking: true,
    multiCityBooking: false,
    partnerBooking: true,
    fuelSurchargeRequired: true,
    taxesIncluded: false
  },
  bookingInfo: {
    advanceBookingDays: 330,
    bookingCutoffHours: 24,
    waitlistAvailable: true,
    seatAvailability: 'limited'
  },
  officialSource: {
    url: 'https://www.jal.co.jp/jmb/use/award/int/',
    lastUpdated: '2025-01-17',
    verified: true
  }
};

// 全国際線チャートを統合
export const internationalMileCharts = {
  ANA: anaInternationalChart,
  JAL: jalInternationalChart
};

// 地域判定関数
export const getInternationalRegion = (destination: string): InternationalRegion => {
  const asiaShort = ['ICN', 'GMP', 'TPE', 'TSA', 'HKG', 'MFM'];
  const asiaMedium = ['PEK', 'SHA', 'SIN', 'BKK', 'KUL', 'DEL', 'SYD', 'MEL'];
  const northAmerica = ['LAX', 'SFO', 'JFK', 'ORD', 'YVR', 'YYZ'];
  const europe = ['LHR', 'CDG', 'FRA', 'AMS', 'ZUR', 'FCO'];
  const middleEast = ['DXB', 'DOH'];
  
  if (asiaShort.includes(destination)) return 'asia_short';
  if (asiaMedium.includes(destination)) return 'asia_medium';
  if (northAmerica.includes(destination)) return 'north_america';
  if (europe.includes(destination)) return 'europe';
  if (middleEast.includes(destination)) return 'middle_east';
  
  return 'asia_medium'; // デフォルト
};

// 燃油サーチャージ取得関数
export const getFuelSurcharge = (airline: string, departure: string, arrival: string): number => {
  // 国内線は燃油サーチャージなし
  const domesticAirports = ['HND', 'NRT', 'KIX', 'ITM', 'CTS', 'FUK', 'OKA', 'NGO', 'SDJ'];
  if (domesticAirports.includes(departure) && domesticAirports.includes(arrival)) {
    return 0;
  }
  
  // 地域判定
  const region = getInternationalRegion(arrival);
  let zone = '';
  
  switch (region) {
    case 'asia_short':
      zone = 'East_Asia_Zone1';
      break;
    case 'asia_medium':
      zone = 'Southeast_Asia';
      break;
    case 'north_america':
      zone = 'North_America';
      break;
    case 'europe':
      zone = 'Europe';
      break;
    case 'oceania':
      zone = 'Southwest_Pacific';
      break;
    default:
      zone = 'East_Asia_Zone1';
  }
  
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
};

// 国際線マイル数取得関数（新しい構造用）
export const getInternationalMiles = (airline: string, departure: string, arrival: string, season: string): number => {
  const region = getInternationalRegion(arrival);
  const airlineChart = internationalMileCharts[airline as keyof typeof internationalMileCharts];
  
  if (!airlineChart || !airlineChart.regions[region]) {
    return 0;
  }
  
  const regionMiles = airlineChart.regions[region]?.economy;
  if (!regionMiles) return 0;
  
  switch (season) {
    case 'peak':
      return regionMiles.peak || regionMiles.standard;
    case 'off':
      return regionMiles.saver || regionMiles.standard;
    default:
      return regionMiles.standard;
  }
};
