import { MileRequirement } from '../types';

// 海外航空会社のマイルプログラムデータ（2025年版対応）
export interface ForeignAirlineMileChart {
  [airline: string]: {
    [route: string]: MileRequirement;
  };
}

// 海外航空会社詳細情報
export interface ForeignAirlineDetails {
  id: string;
  name: string;
  program: string;
  alliance: 'star' | 'oneworld' | 'skyteam' | 'independent';
  milesExpiry: string;
  fuelSurcharge: boolean;
  routes: { [route: string]: { economy: number; business: number; first: number | null } };
  transferRates: { [source: string]: { rate: number; bonus: number; minimum: number } };
  creditCards: string[];
  features: {
    stopover: string;
    openJaw: boolean;
    changesFee: number;
    bookingWindow: number;
  };
}

// ユナイテッド航空 MileagePlus（スターアライアンス）
export const unitedMileChart: { [route: string]: MileRequirement } = {
  // 日本発着路線（往復エコノミー）- 2025年改定版
  'Japan_Korea': { off: 22000, regular: 25000, peak: 35000 },
  'Japan_China': { off: 40000, regular: 40000, peak: 50000 },
  'Japan_Southeast_Asia': { off: 70000, regular: 75000, peak: 85000 },
  'Japan_Australia': { off: 80000, regular: 85000, peak: 95000 },
  'Japan_North_America_West': { off: 70000, regular: 80000, peak: 90000 },
  'Japan_North_America_East': { off: 80000, regular: 90000, peak: 100000 },
  'Japan_Europe': { off: 70000, regular: 80000, peak: 90000 },
  'Japan_Middle_East': { off: 80000, regular: 90000, peak: 100000 },
};

// アメリカン航空 AAdvantage（ワンワールド）
export const americanMileChart: { [route: string]: MileRequirement } = {
  // 日本発着路線（往復エコノミー）- 需要ベース変動制
  'Japan_Korea': { off: 25000, regular: 35000, peak: 50000 },
  'Japan_China': { off: 40000, regular: 50000, peak: 70000 },
  'Japan_Southeast_Asia': { off: 40000, regular: 55000, peak: 75000 },
  'Japan_Australia': { off: 50000, regular: 65000, peak: 80000 },
  'Japan_North_America': { off: 60000, regular: 75000, peak: 95000 },
  'Japan_Europe': { off: 75000, regular: 90000, peak: 110000 },
  'Japan_Middle_East': { off: 70000, regular: 85000, peak: 105000 },
};

// デルタ航空 SkyMiles（スカイチーム）
export const deltaMileChart: { [route: string]: MileRequirement } = {
  // 日本発着路線（往復エコノミー）- 完全需要ベース変動制
  'Japan_Korea': { off: 30000, regular: 45000, peak: 70000 },
  'Japan_China': { off: 45000, regular: 60000, peak: 90000 },
  'Japan_Southeast_Asia': { off: 45000, regular: 65000, peak: 95000 },
  'Japan_Australia': { off: 55000, regular: 75000, peak: 110000 },
  'Japan_North_America': { off: 75000, regular: 95000, peak: 140000 },
  'Japan_Europe': { off: 85000, regular: 110000, peak: 160000 },
  'Japan_Middle_East': { off: 80000, regular: 100000, peak: 145000 },
};

// ブリティッシュ・エアウェイズ Executive Club（ワンワールド）
// 距離ベース制（Zone 制）
export const britishAirwaysMileChart: { [route: string]: MileRequirement } = {
  // 距離ベース（片道）なので往復は×2
  'Zone_1_650miles': { off: 4500, regular: 4500, peak: 7500 }, // 往復×2
  'Zone_2_1151miles': { off: 7500, regular: 7500, peak: 12500 }, // 往復×2
  'Zone_3_2000miles': { off: 9000, regular: 9000, peak: 15000 }, // 往復×2
  'Zone_4_3000miles': { off: 10000, regular: 10000, peak: 20000 }, // 往復×2
  'Zone_5_4000miles': { off: 13000, regular: 13000, peak: 25000 }, // 往復×2
  'Zone_6_5500miles': { off: 16250, regular: 16250, peak: 30000 }, // 往復×2
  'Zone_7_6500miles': { off: 19000, regular: 19000, peak: 35000 }, // 往復×2
  'Zone_8_7000miles': { off: 21250, regular: 21250, peak: 40000 }, // 往復×2
  'Zone_9_plus': { off: 25000, regular: 25000, peak: 50000 }, // 往復×2
};

// シンガポール航空 KrisFlyer（スターアライアンス）
export const singaporeMileChart: { [route: string]: MileRequirement } = {
  // 日本発着路線（往復エコノミー）
  'Japan_Korea': { off: 25000, regular: 25000, peak: 32500 },
  'Japan_China': { off: 35000, regular: 35000, peak: 45000 },
  'Japan_Southeast_Asia': { off: 35000, regular: 42500, peak: 52500 },
  'Japan_Australia': { off: 42500, regular: 50000, peak: 62500 },
  'Japan_North_America': { off: 67500, regular: 80000, peak: 97500 },
  'Japan_Europe': { off: 67500, regular: 80000, peak: 97500 },
  'Japan_Middle_East': { off: 52500, regular: 62500, peak: 77500 },
};

// エミレーツ航空 Skywards（独立系）
export const emiratesMileChart: { [route: string]: MileRequirement } = {
  // 日本発着路線（往復エコノミー）
  'Japan_Middle_East': { off: 50000, regular: 62500, peak: 87500 },
  'Japan_Europe': { off: 62500, regular: 75000, peak: 100000 },
  'Japan_Africa': { off: 75000, regular: 87500, peak: 112500 },
  'Japan_North_America': { off: 87500, regular: 100000, peak: 125000 },
  'Japan_South_America': { off: 100000, regular: 125000, peak: 150000 },
};

// 航空会社とアライアンスの対応
export const airlineAlliances = {
  'United': 'Star Alliance',
  'ANA': 'Star Alliance',
  'Lufthansa': 'Star Alliance',
  'Singapore': 'Star Alliance',
  'Thai': 'Star Alliance',
  'Air Canada': 'Star Alliance',
  
  'American': 'oneworld',
  'JAL': 'oneworld',
  'British Airways': 'oneworld',
  'Cathay Pacific': 'oneworld',
  'Qantas': 'oneworld',
  'Finnair': 'oneworld',
  
  'Delta': 'SkyTeam',
  'Air France': 'SkyTeam',
  'KLM': 'SkyTeam',
  'Korean Air': 'SkyTeam',
  'China Eastern': 'SkyTeam',
  'Aeromexico': 'SkyTeam',
  
  'Emirates': 'Independent',
  'Etihad': 'Independent',
  'Turkish': 'Star Alliance',
  'Qatar': 'oneworld',
};

// クレジットカードポイント移行レート
export const creditCardTransferRates = {
  'Amex_MR': {
    'ANA': { rate: 1, ratio: 1, bonus: 0.4, condition: 'Premium member' },
    'JAL': { rate: 2, ratio: 1, bonus: 0, condition: 'Standard' },
    'United': { rate: 1, ratio: 1, bonus: 0, condition: 'Standard' },
    'Delta': { rate: 1, ratio: 1, bonus: 0, condition: 'Standard' },
    'British Airways': { rate: 1, ratio: 1, bonus: 0, condition: 'Standard' },
    'Singapore': { rate: 1, ratio: 1, bonus: 0, condition: 'Standard' },
  },
  'Chase_UR': {
    'United': { rate: 1, ratio: 1, bonus: 0, condition: 'US residents only' },
    'Southwest': { rate: 1, ratio: 1, bonus: 0, condition: 'US residents only' },
    'British Airways': { rate: 1, ratio: 1, bonus: 0, condition: 'US residents only' },
    'Singapore': { rate: 1, ratio: 1, bonus: 0, condition: 'US residents only' },
  },
  'Citi_ThankYou': {
    'American': { rate: 1, ratio: 1, bonus: 0, condition: 'Premier card' },
    'JAL': { rate: 1, ratio: 1, bonus: 0, condition: 'Premier card' },
    'Cathay Pacific': { rate: 1, ratio: 1, bonus: 0, condition: 'Premier card' },
    'Singapore': { rate: 1, ratio: 1, bonus: 0, condition: 'Premier card' },
  },
};

// ホテルポイント移行レート
export const hotelTransferRates = {
  'Marriott_Bonvoy': {
    'ANA': { rate: 3, ratio: 1, bonus: 5000, condition: '60,000pt transfer' },
    'JAL': { rate: 3, ratio: 1, bonus: 5000, condition: '60,000pt transfer' },
    'United': { rate: 3, ratio: 1, bonus: 5000, condition: '60,000pt transfer' },
    'American': { rate: 3, ratio: 1, bonus: 5000, condition: '60,000pt transfer' },
    'Delta': { rate: 3, ratio: 1, bonus: 5000, condition: '60,000pt transfer' },
    'Alaska': { rate: 3, ratio: 1, bonus: 5000, condition: '60,000pt transfer' },
  },
  'Hilton_Honors': {
    'ANA': { rate: 10, ratio: 1, bonus: 0, condition: 'Standard' },
    'JAL': { rate: 10, ratio: 1, bonus: 0, condition: 'Standard' },
    'Virgin Atlantic': { rate: 10, ratio: 1, bonus: 0, condition: 'Standard' },
  },
  'IHG_Rewards': {
    'ANA': { rate: 5, ratio: 1, bonus: 0, condition: 'Standard' },
    'JAL': { rate: 5, ratio: 1, bonus: 0, condition: 'Standard' },
    'United': { rate: 5, ratio: 1, bonus: 0, condition: 'Standard' },
  },
};

// 燃油サーチャージ（海外航空会社・2025年目安）
export const foreignAirlineFuelSurcharge = {
  'United': {
    'Japan_Korea': 100, // USD
    'Japan_China': 200,
    'Japan_Southeast_Asia': 250,
    'Japan_Australia': 300,
    'Japan_North_America': 200,
    'Japan_Europe': 350,
  },
  'American': {
    'Japan_Korea': 0, // サーチャージなし
    'Japan_China': 0,
    'Japan_Southeast_Asia': 0,
    'Japan_Australia': 0,
    'Japan_North_America': 0,
    'Japan_Europe': 0,
  },
  'Delta': {
    'Japan_Korea': 0, // サーチャージなし
    'Japan_China': 0,
    'Japan_Southeast_Asia': 0,
    'Japan_Australia': 0,
    'Japan_North_America': 0,
    'Japan_Europe': 0,
  },
  'British_Airways': {
    'Zone_1_650miles': 50, // GBP
    'Zone_2_1151miles': 75,
    'Zone_3_2000miles': 100,
    'Zone_4_3000miles': 150,
    'Zone_5_4000miles': 200,
    'Zone_6_5500miles': 250,
    'Zone_7_6500miles': 300,
    'Zone_8_7000miles': 350,
    'Zone_9_plus': 400,
  },
  'Singapore': {
    'Japan_Korea': 150, // SGD
    'Japan_China': 200,
    'Japan_Southeast_Asia': 150,
    'Japan_Australia': 250,
    'Japan_North_America': 400,
    'Japan_Europe': 450,
  },
  'Emirates': {
    'Japan_Middle_East': 300, // USD
    'Japan_Europe': 400,
    'Japan_Africa': 450,
    'Japan_North_America': 500,
    'Japan_South_America': 600,
  },
};

// ルート判定関数
export function getRouteCategory(departureCode: string, arrivalCode: string): string {
  // 実際の実装では空港コードから地域を判定
  // ここでは簡易版
  const asianCodes = ['ICN', 'PVG', 'PEK', 'TPE', 'HKG'];
  const northAmericaCodes = ['LAX', 'SFO', 'JFK', 'ORD', 'YVR'];
  const europeanCodes = ['LHR', 'CDG', 'FRA', 'AMS', 'MUC'];
  const middleEastCodes = ['DXB', 'DOH', 'AUH'];
  const southeastAsiaCodes = ['SIN', 'BKK', 'KUL', 'CGK'];
  const australiaCodes = ['SYD', 'MEL', 'BNE'];
  
  const isJapan = ['NRT', 'HND', 'KIX', 'ITM', 'NGO'].includes(departureCode) || 
                  ['NRT', 'HND', 'KIX', 'ITM', 'NGO'].includes(arrivalCode);
  
  if (!isJapan) return 'Unknown';
  
  const intlCode = ![...['NRT', 'HND', 'KIX', 'ITM', 'NGO']].includes(arrivalCode) ? 
                   arrivalCode : departureCode;
  
  if (asianCodes.includes(intlCode)) {
    if (['ICN'].includes(intlCode)) return 'Japan_Korea';
    if (['PVG', 'PEK'].includes(intlCode)) return 'Japan_China';
    return 'Japan_China';
  }
  
  if (southeastAsiaCodes.includes(intlCode)) return 'Japan_Southeast_Asia';
  if (northAmericaCodes.includes(intlCode)) {
    if (['LAX', 'SFO'].includes(intlCode)) return 'Japan_North_America_West';
    return 'Japan_North_America_East';
  }
  if (europeanCodes.includes(intlCode)) return 'Japan_Europe';
  if (middleEastCodes.includes(intlCode)) return 'Japan_Middle_East';
  if (australiaCodes.includes(intlCode)) return 'Japan_Australia';
  
  return 'Unknown';
}

// 距離からBAゾーンを判定
export function getBritishAirwaysZone(distance: number): string {
  if (distance <= 650) return 'Zone_1_650miles';
  if (distance <= 1151) return 'Zone_2_1151miles';
  if (distance <= 2000) return 'Zone_3_2000miles';
  if (distance <= 3000) return 'Zone_4_3000miles';
  if (distance <= 4000) return 'Zone_5_4000miles';
  if (distance <= 5500) return 'Zone_6_5500miles';
  if (distance <= 6500) return 'Zone_7_6500miles';
  if (distance <= 7000) return 'Zone_8_7000miles';
  return 'Zone_9_plus';
}

// 海外マイルプログラムのマイル取得
export function getForeignAirlineMiles(
  airline: string,
  departureCode: string,
  arrivalCode: string,
  distance: number,
  season: 'off' | 'regular' | 'peak'
): MileRequirement | null {
  const routeCategory = getRouteCategory(departureCode, arrivalCode);
  
  if (routeCategory === 'Unknown') return null;
  
  switch (airline) {
    case 'United':
      return unitedMileChart[routeCategory] || null;
    
    case 'American':
      return americanMileChart[routeCategory] || null;
    
    case 'Delta':
      return deltaMileChart[routeCategory] || null;
    
    case 'British Airways':
      const baZone = getBritishAirwaysZone(distance);
      const baseMiles = britishAirwaysMileChart[baZone];
      if (baseMiles) {
        // 往復なので×2
        return {
          off: baseMiles.off * 2,
          regular: baseMiles.regular * 2,
          peak: baseMiles.peak * 2
        };
      }
      return null;
    
    case 'Singapore':
      return singaporeMileChart[routeCategory] || null;
    
    case 'Emirates':
      return emiratesMileChart[routeCategory] || null;
    
    default:
      return null;
  }
}

// 燃油サーチャージ取得（海外航空会社）
export function getForeignAirlineFuelSurcharge(
  airline: string,
  departureCode: string,
  arrivalCode: string,
  distance: number
): { amount: number; currency: string } {
  const routeCategory = getRouteCategory(departureCode, arrivalCode);
  
  switch (airline) {
    case 'United':
      return {
        amount: foreignAirlineFuelSurcharge.United[routeCategory as keyof typeof foreignAirlineFuelSurcharge.United] || 0,
        currency: 'USD'
      };
    
    case 'American':
    case 'Delta':
      return { amount: 0, currency: 'USD' }; // サーチャージなし
    
    case 'British Airways':
      const baZone = getBritishAirwaysZone(distance);
      return {
        amount: foreignAirlineFuelSurcharge.British_Airways[baZone as keyof typeof foreignAirlineFuelSurcharge.British_Airways] || 0,
        currency: 'GBP'
      };
    
    case 'Singapore':
      return {
        amount: foreignAirlineFuelSurcharge.Singapore[routeCategory as keyof typeof foreignAirlineFuelSurcharge.Singapore] || 0,
        currency: 'SGD'
      };
    
    case 'Emirates':
      return {
        amount: foreignAirlineFuelSurcharge.Emirates[routeCategory as keyof typeof foreignAirlineFuelSurcharge.Emirates] || 0,
        currency: 'USD'
      };
    
    default:
      return { amount: 0, currency: 'USD' };
  }
}

// 海外航空会社詳細情報（2025年版）
export const foreignAirlineDetails: ForeignAirlineDetails[] = [
  // スターアライアンス
  {
    id: 'united',
    name: 'ユナイテッド航空',
    program: 'MileagePlus',
    alliance: 'star',
    milesExpiry: '無期限',
    fuelSurcharge: false,
    routes: {
      'NRT-LAX': { economy: 80000, business: 160000, first: 220000 },
      'NRT-LHR': { economy: 80000, business: 160000, first: 220000 },
      'NRT-ICN': { economy: 22000, business: 44000, first: null },
      'NRT-SIN': { economy: 75000, business: 150000, first: 200000 },
      'KIX-ICN': { economy: 22000, business: 44000, first: null },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      diners: { rate: 2, bonus: 0, minimum: 1000 },
    },
    creditCards: ['MileagePlus JCBゴールド（100円=1.5マイル）'],
    features: {
      stopover: 'Excursionist Perk（同リージョン1区間無料）',
      openJaw: true,
      changesFee: 0,
      bookingWindow: 337,
    },
  },
  {
    id: 'singapore',
    name: 'シンガポール航空',
    program: 'KrisFlyer',
    alliance: 'star',
    milesExpiry: '36ヶ月',
    fuelSurcharge: true,
    routes: {
      'NRT-LAX': { economy: 80000, business: 175000, first: 225000 },
      'NRT-LHR': { economy: 90000, business: 195000, first: 250000 },
      'NRT-ICN': { economy: 25000, business: 55000, first: null },
      'NRT-SIN': { economy: 42500, business: 95000, first: 180000 },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      amex: { rate: 1, bonus: 0, minimum: 1000 },
    },
    creditCards: ['アメックス・スカイトラベラー（1P=1マイル）', '三井住友VISAプラチナトラベル'],
    features: {
      stopover: 'Saver 1回/Standard 2回',
      openJaw: true,
      changesFee: 25,
      bookingWindow: 355,
    },
  },
  // ワンワールド
  {
    id: 'american',
    name: 'アメリカン航空',
    program: 'AAdvantage',
    alliance: 'oneworld',
    milesExpiry: '24ヶ月（加算で延長）',
    fuelSurcharge: true,
    routes: {
      'NRT-LAX': { economy: 60000, business: 115000, first: 170000 },
      'NRT-LHR': { economy: 60000, business: 115000, first: 170000 },
      'NRT-ICN': { economy: 20000, business: 40000, first: null },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      diners: { rate: 2, bonus: 0, minimum: 1000 },
    },
    creditCards: ['日本発行直接カード なし'],
    features: {
      stopover: '不可',
      openJaw: true,
      changesFee: 150,
      bookingWindow: 331,
    },
  },
  {
    id: 'british_airways',
    name: 'ブリティッシュ・エアウェイズ',
    program: 'Executive Club (Avios)',
    alliance: 'oneworld',
    milesExpiry: '無期限（36ヶ月活動要）',
    fuelSurcharge: true,
    routes: {
      'NRT-LAX': { economy: 77000, business: 140000, first: 200000 },
      'NRT-LHR': { economy: 70000, business: 125000, first: 180000 },
      'NRT-ICN': { economy: 15000, business: 30000, first: null },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      amex: { rate: 1, bonus: 0, minimum: 1000 },
    },
    creditCards: ['アメックス・グリーン/ゴールド/プラチナ（1P=1Avios）'],
    features: {
      stopover: '可（複数区間OK）',
      openJaw: true,
      changesFee: 35,
      bookingWindow: 355,
    },
  },
  {
    id: 'cathay_pacific',
    name: 'キャセイパシフィック',
    program: 'Asia Miles',
    alliance: 'oneworld',
    milesExpiry: '無期限（2024改定）',
    fuelSurcharge: true,
    routes: {
      'NRT-LAX': { economy: 75000, business: 150000, first: 210000 },
      'NRT-LHR': { economy: 67500, business: 135000, first: 190000 },
      'NRT-ICN': { economy: 15000, business: 30000, first: null },
      'NRT-SIN': { economy: 30000, business: 60000, first: 105000 },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      amex: { rate: 1, bonus: 0, minimum: 1000 },
    },
    creditCards: ['キャセイパシフィックMUFGカード プラチナ（100円=1マイル）'],
    features: {
      stopover: '2回/片道',
      openJaw: true,
      changesFee: 25,
      bookingWindow: 361,
    },
  },
  // スカイチーム
  {
    id: 'delta',
    name: 'デルタ航空',
    program: 'SkyMiles',
    alliance: 'skyteam',
    milesExpiry: '無期限',
    fuelSurcharge: false,
    routes: {
      'NRT-LAX': { economy: 95000, business: 195000, first: 350000 },
      'NRT-ICN': { economy: 20000, business: 80000, first: null },
      'NRT-SEA': { economy: 95000, business: 195000, first: 350000 },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      amex: { rate: 1, bonus: 0, minimum: 1000 },
    },
    creditCards: ['デルタ スカイマイルAMEXゴールド（100円=1マイル）'],
    features: {
      stopover: '不可',
      openJaw: true,
      changesFee: 0,
      bookingWindow: 331,
    },
  },
  {
    id: 'flying_blue',
    name: 'エールフランス/KLM',
    program: 'Flying Blue',
    alliance: 'skyteam',
    milesExpiry: '24ヶ月延長',
    fuelSurcharge: true,
    routes: {
      'NRT-LHR': { economy: 55000, business: 140000, first: 220000 },
      'NRT-CDG': { economy: 55000, business: 140000, first: 220000 },
      'NRT-ICN': { economy: 17000, business: 50000, first: null },
      'NRT-SIN': { economy: 35000, business: 90000, first: 170000 },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      amex: { rate: 1, bonus: 0, minimum: 1000 },
    },
    creditCards: ['アメックスMR(JP)（1P=1マイル）'],
    features: {
      stopover: '不可',
      openJaw: true,
      changesFee: 50,
      bookingWindow: 348,
    },
  },
  // 独立系
  {
    id: 'emirates',
    name: 'エミレーツ航空',
    program: 'Skywards',
    alliance: 'independent',
    milesExpiry: '36ヶ月',
    fuelSurcharge: true,
    routes: {
      'NRT-LHR': { economy: 75000, business: 150000, first: 210000 },
      'NRT-DXB': { economy: 62500, business: 125000, first: 175000 },
      'NRT-BKK': { economy: 30000, business: 75000, first: 135000 },
    },
    transferRates: {
      marriott: { rate: 3, bonus: 5000, minimum: 60000 },
      amex: { rate: 1, bonus: 0, minimum: 1000 },
    },
    creditCards: ['アメックスMR（1P=1マイル）'],
    features: {
      stopover: 'DXB可',
      openJaw: true,
      changesFee: 50,
      bookingWindow: 355,
    },
  },
];
