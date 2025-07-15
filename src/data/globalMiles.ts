import { GlobalMileChart, UnitedMileChart, AmericanMileChart, SingaporeMileChart } from '../types/globalMiles';

// ユナイテッド航空のマイルチャート
export const UNITED_MILES: UnitedMileChart = {
  alliance: 'StarAlliance',
  partners: ['ANA', 'LH', 'SQ', 'TG', 'AC', 'SN', 'OS', 'LX', 'SK', 'TP'],
  currency: 'USD',
  
  domestic: {
    short: {
      saver: 5000,
      standard: 10000,
      peak: 12500,
      availability: 'medium'
    },
    medium: {
      saver: 12500,
      standard: 25000,
      peak: 30000,
      availability: 'medium'
    },
    long: {
      saver: 20000,
      standard: 30000,
      peak: 35000,
      availability: 'low'
    }
  },
  
  international: {
    asia: {
      economy: {
        saver: 35000,
        standard: 50000,
        peak: 70000,
        availability: 'low'
      },
      business: {
        saver: 70000,
        standard: 85000,
        peak: 100000,
        availability: 'low'
      },
      first: {
        saver: 120000,
        standard: 140000,
        peak: 160000,
        availability: 'low'
      }
    },
    europe: {
      economy: {
        saver: 30000,
        standard: 60000,
        peak: 70000,
        availability: 'medium'
      },
      business: {
        saver: 60000,
        standard: 100000,
        peak: 120000,
        availability: 'low'
      },
      first: {
        saver: 110000,
        standard: 150000,
        peak: 180000,
        availability: 'low'
      }
    },
    oceania: {
      economy: {
        saver: 40000,
        standard: 65000,
        peak: 80000,
        availability: 'medium'
      },
      business: {
        saver: 80000,
        standard: 110000,
        peak: 140000,
        availability: 'low'
      }
    },
    africa: {
      economy: {
        saver: 45000,
        standard: 70000,
        peak: 85000,
        availability: 'low'
      },
      business: {
        saver: 90000,
        standard: 120000,
        peak: 150000,
        availability: 'low'
      }
    },
    south_america: {
      economy: {
        saver: 35000,
        standard: 60000,
        peak: 75000,
        availability: 'medium'
      },
      business: {
        saver: 70000,
        standard: 100000,
        peak: 130000,
        availability: 'low'
      }
    }
  },
  
  dynamicPricing: true,
  excursionist: true,
  openJaw: true,
  stopovers: 1
};

// アメリカン航空のマイルチャート
export const AMERICAN_MILES: AmericanMileChart = {
  alliance: 'OneWorld',
  partners: ['JAL', 'BA', 'QR', 'CX', 'IB', 'FJ', 'RJ', 'AT'],
  
  webSpecial: {
    discount: 0.15, // 15%割引
    availability: ['Tuesday', 'Wednesday', 'Saturday'] // 曜日限定
  },
  
  offPeak: {
    discount: 0.10, // 10%割引
    months: ['January', 'February', 'November', 'December']
  },
  
  peak: {
    surcharge: 0.30, // 30%増
    months: ['June', 'July', 'August', 'December 20-31']
  },
  
  dynamicPricing: true,
  milesOrPoints: true
};

// シンガポール航空のマイルチャート  
export const SINGAPORE_MILES: SingaporeMileChart = {
  alliance: 'StarAlliance',
  program: 'KrisFlyer',
  
  spontaneousEscapes: {
    discount: 0.30, // 30%割引
    bookingWindow: 14 // 14日前から予約可能
  },
  
  advantageAwards: {
    premiumCabinDiscount: 0.15, // プレミアムキャビン15%割引
    eligibility: ['KrisFlyer Elite Gold', 'KrisFlyer Elite Silver']
  },
  
  preferredSeats: true,
  waitlist: true
};

// 世界主要航空会社のマイル価値データベース
export const MILE_VALUES = {
  // 日本系
  ANA: {
    averageValue: 1.8, // 1マイル = 1.8円
    bestCaseValue: 3.5, // ファーストクラス国際線
    worstCaseValue: 1.0, // 国内線エコノミー
    volatility: 0.2,
    liquidity: 0.9,
    transferability: 0.7,
    expirationRisk: 0.1
  },
  JAL: {
    averageValue: 1.7,
    bestCaseValue: 3.2,
    worstCaseValue: 1.0,
    volatility: 0.2,
    liquidity: 0.9,
    transferability: 0.6,
    expirationRisk: 0.1
  },
  
  // アメリカ系
  UA: {
    averageValue: 1.4, // 1マイル = 1.4円
    bestCaseValue: 2.8,
    worstCaseValue: 0.8,
    volatility: 0.3,
    liquidity: 0.8,
    transferability: 0.8,
    expirationRisk: 0.2
  },
  AA: {
    averageValue: 1.3,
    bestCaseValue: 2.5,
    worstCaseValue: 0.7,
    volatility: 0.4,
    liquidity: 0.8,
    transferability: 0.7,
    expirationRisk: 0.3
  },
  DL: {
    averageValue: 1.2,
    bestCaseValue: 2.2,
    worstCaseValue: 0.6,
    volatility: 0.5,
    liquidity: 0.7,
    transferability: 0.5,
    expirationRisk: 0.2
  },
  
  // ヨーロッパ系
  LH: {
    averageValue: 1.5,
    bestCaseValue: 2.8,
    worstCaseValue: 0.9,
    volatility: 0.3,
    liquidity: 0.7,
    transferability: 0.8,
    expirationRisk: 0.1
  },
  BA: {
    averageValue: 1.4,
    bestCaseValue: 2.6,
    worstCaseValue: 0.8,
    volatility: 0.3,
    liquidity: 0.8,
    transferability: 0.7,
    expirationRisk: 0.2
  },
  
  // アジア系
  SQ: {
    averageValue: 1.6,
    bestCaseValue: 3.0,
    worstCaseValue: 1.0,
    volatility: 0.2,
    liquidity: 0.8,
    transferability: 0.6,
    expirationRisk: 0.1
  },
  CX: {
    averageValue: 1.5,
    bestCaseValue: 2.7,
    worstCaseValue: 0.9,
    volatility: 0.3,
    liquidity: 0.8,
    transferability: 0.7,
    expirationRisk: 0.2
  },
  
  // 中東系
  QR: {
    averageValue: 1.7,
    bestCaseValue: 3.2,
    worstCaseValue: 1.1,
    volatility: 0.2,
    liquidity: 0.9,
    transferability: 0.6,
    expirationRisk: 0.1
  },
  EK: {
    averageValue: 1.6,
    bestCaseValue: 2.9,
    worstCaseValue: 1.0,
    volatility: 0.3,
    liquidity: 0.8,
    transferability: 0.5,
    expirationRisk: 0.1
  }
};

// クレジットカードポイント移行レート
export const CREDIT_CARD_TRANSFERS = {
  AMEX_MR: {
    transfers: [
      { airline: 'ANA', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'JAL', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'SQ', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'CX', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'BA', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'LH', ratio: '1000:1000', fee: 0, time: '即座' }
    ],
    minimumTransfer: 1000,
    maximumTransfer: 1000000
  },
  
  CHASE_UR: {
    transfers: [
      { airline: 'UA', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'SQ', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'BA', ratio: '1000:1000', fee: 0, time: '即座' },
      { airline: 'LH', ratio: '1000:1000', fee: 0, time: '即座' }
    ],
    minimumTransfer: 1000,
    maximumTransfer: 1000000
  },
  
  MARRIOTT_BONVOY: {
    transfers: [
      { airline: 'ANA', ratio: '3000:1000', fee: 0, time: '1-3営業日' },
      { airline: 'JAL', ratio: '3000:1000', fee: 0, time: '1-3営業日' },
      { airline: 'UA', ratio: '3000:1000', fee: 0, time: '1-3営業日' },
      { airline: 'AA', ratio: '3000:1000', fee: 0, time: '1-3営業日' },
      { airline: 'SQ', ratio: '3000:1000', fee: 0, time: '1-3営業日' },
      { airline: 'CX', ratio: '3000:1000', fee: 0, time: '1-3営業日' }
    ],
    bonusAt60000: 5000, // 60,000ポイント移行時に5,000マイルボーナス
    minimumTransfer: 3000,
    maximumTransfer: 240000
  }
};

// 人気ルートのマイル要件データベース
export const POPULAR_ROUTES_MILES = {
  // 日本発アジア
  'NRT-ICN': { // 東京-ソウル
    ANA: { economy: 15000, business: 30000 },
    JAL: { economy: 15000, business: 30000 },
    UA: { economy: 22500, business: 45000 },
    AA: { economy: 22500, business: 45000 }
  },
  
  'NRT-TPE': { // 東京-台北
    ANA: { economy: 17000, business: 34000 },
    JAL: { economy: 17000, business: 34000 },
    SQ: { economy: 22500, business: 42500 },
    CX: { economy: 20000, business: 40000 }
  },
  
  // 日本発北米
  'NRT-LAX': { // 東京-ロサンゼルス
    ANA: { economy: 40000, business: 85000, first: 150000 },
    JAL: { economy: 40000, business: 80000, first: 140000 },
    UA: { economy: 70000, business: 100000, first: 160000 },
    AA: { economy: 60000, business: 110000, first: 160000 }
  },
  
  'NRT-JFK': { // 東京-ニューヨーク
    ANA: { economy: 40000, business: 85000, first: 150000 },
    JAL: { economy: 40000, business: 80000, first: 140000 },
    UA: { economy: 70000, business: 100000, first: 160000 },
    AA: { economy: 60000, business: 110000, first: 160000 }
  },
  
  // 日本発ヨーロッパ
  'NRT-LHR': { // 東京-ロンドン
    ANA: { economy: 45000, business: 90000, first: 165000 },
    JAL: { economy: 45000, business: 85000, first: 160000 },
    BA: { economy: 60000, business: 100000, first: 170000 },
    LH: { economy: 55000, business: 105000, first: 180000 }
  },
  
  'NRT-CDG': { // 東京-パリ
    ANA: { economy: 45000, business: 90000, first: 165000 },
    JAL: { economy: 45000, business: 85000, first: 160000 },
    AF: { economy: 60000, business: 110000, first: 180000 }
  },
  
  // 日本発オセアニア
  'NRT-SYD': { // 東京-シドニー
    ANA: { economy: 35000, business: 65000 },
    JAL: { economy: 35000, business: 65000 },
    QF: { economy: 45000, business: 80000, first: 140000 },
    SQ: { economy: 42500, business: 77500 }
  },
  
  // 国内線
  'HND-CTS': { // 羽田-新千歳
    ANA: { economy: 15000, premium: 21000 },
    JAL: { economy: 15000, premium: 21000 }
  },
  
  'HND-OKA': { // 羽田-那覇
    ANA: { economy: 18000, premium: 21000 },
    JAL: { economy: 18000, premium: 21000 }
  }
};

export default {
  UNITED_MILES,
  AMERICAN_MILES,
  SINGAPORE_MILES,
  MILE_VALUES,
  CREDIT_CARD_TRANSFERS,
  POPULAR_ROUTES_MILES
};
