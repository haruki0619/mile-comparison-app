// アメリカ系航空会社のマイルデータ

// 基本的な型定義（再利用）
interface MileRequirement {
  regular?: number;
  min?: number;
  max?: number;
}

interface FuelSurcharge {
  amount: number;
  currency: string;
  lastUpdated: string;
  notes?: string;
}

interface BookingRules {
  advanceBookingDays: number;
  bookingDeadline: {
    web: string;
    phone: string;
  };
  changePolicy: string;
  cancellationFee: {
    domestic: string;
    international: string;
  };
}

interface JapaneseSupport {
  website: boolean;
  callCenter: boolean;
  notes: string;
}

interface DataQuality {
  status: string;
  source: string;
  lastVerified: string;
  notes: string;
}

interface MileageProgram {
  code: string;
  name: string;
  nameJa: string;
  alliance: string;
  website: string;
  lastUpdated: string;
  dataQuality: DataQuality;
  domesticRoutes: Record<string, any>;
  internationalRoutes: Record<string, Record<string, MileRequirement>>;
  fuelSurcharge: Record<string, FuelSurcharge>;
  bookingRules: BookingRules;
  japaneseSupport: JapaneseSupport;
}

export const AMERICAN_AIRLINES: Record<string, MileageProgram> = {
  // United MileagePlus
  UNITED: {
    code: 'UNITED',
    name: 'United MileagePlus',
    nameJa: 'ユナイテッド・マイレージプラス',
    alliance: 'Star Alliance',
    website: 'https://www.united.com/mileageplus',
    lastUpdated: '2025-07-16',
    
    dataQuality: {
      status: 'verified',
      source: 'official_screenshot',
      lastVerified: '2025-07-16',
      notes: '公式アワードチャート（2024年版）+実検索で検証済み'
    },
    
    domesticRoutes: {},
    
    internationalRoutes: {
      'NRT-LAX': {
        economy: { regular: 70000 },
        business: { regular: 140000 }
      },
      'NRT-LHR': {
        economy: { regular: 60000 },
        business: { regular: 140000 }
      },
      'NRT-SIN': {
        economy: { regular: 80000 },
        business: { regular: 155000 }
      }
    },
    
    fuelSurcharge: {
      'NRT-LAX': { amount: 5600, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-LHR': { amount: 5600, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-SIN': { amount: 5600, currency: 'JPY', lastUpdated: '2025-07-16' }
    },
    
    bookingRules: {
      advanceBookingDays: 337,
      bookingDeadline: {
        web: '出発前日',
        phone: '出発前日'
      },
      changePolicy: 'allowed',
      cancellationFee: {
        domestic: '$125 USD',
        international: '$125 USD'
      }
    },
    
    japaneseSupport: {
      website: false,
      callCenter: false,
      notes: '英語のみ対応'
    }
  },

  // American Airlines AAdvantage
  AMERICAN: {
    code: 'AMERICAN',
    name: 'American Airlines AAdvantage',
    nameJa: 'アメリカン航空・アドバンテージ',
    alliance: 'oneworld',
    website: 'https://www.aa.com/aadvantage',
    lastUpdated: '2025-07-16',
    
    dataQuality: {
      status: 'verified',
      source: 'official_pdf',
      lastVerified: '2025-07-16',
      notes: 'MileSAAver Awards公式チャート（2025-03-27）で検証済み'
    },
    
    domesticRoutes: {},
    
    internationalRoutes: {
      'NRT-LAX': {
        economy: { regular: 60000 },
        business: { regular: 125000 },
        first: { regular: 200000 }
      },
      'NRT-LHR': {
        economy: { regular: 57500 },
        business: { regular: 115000 },
        first: { regular: 200000 }
      },
      'NRT-SIN': {
        economy: { regular: 75000 },
        business: { regular: 150000 }
      }
    },
    
    fuelSurcharge: {
      'NRT-LAX': { amount: 0, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-LHR': { amount: 0, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-SIN': { amount: 0, currency: 'JPY', lastUpdated: '2025-07-16' }
    },
    
    bookingRules: {
      advanceBookingDays: 331,
      bookingDeadline: {
        web: '出発前日',
        phone: '出発前日'
      },
      changePolicy: 'allowed',
      cancellationFee: {
        domestic: '$150 USD',
        international: '$150 USD'
      }
    },
    
    japaneseSupport: {
      website: false,
      callCenter: false,
      notes: '英語のみ対応'
    }
  },

  // Delta SkyMiles
  DELTA: {
    code: 'DELTA',
    name: 'Delta SkyMiles',
    nameJa: 'デルタ・スカイマイル',
    alliance: 'SkyTeam',
    website: 'https://ja.delta.com/skymiles/use-miles/award-travel',
    lastUpdated: '2025-07-16',
    
    dataQuality: {
      status: 'verified',
      source: 'calculator_screenshot',
      lastVerified: '2025-07-16',
      notes: '完全ダイナミック制 - 固定チャート廃止（2020-10-01以降）実検索レンジで三重確認済み'
    },
    
    domesticRoutes: {},
    
    internationalRoutes: {
      'NRT-LAX': {
        economy: { min: 40000, max: 95000 },
        business: { min: 95000, max: 240000 }
      },
      'NRT-LHR': {
        economy: { min: 45000, max: 110000 },
        business: { min: 105000, max: 250000 }
      },
      'NRT-SIN': {
        economy: { min: 35000, max: 85000 },
        business: { min: 80000, max: 200000 }
      }
    },
    
    fuelSurcharge: {
      'NRT-LAX': { amount: 28000, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-LHR': { amount: 38000, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-SIN': { amount: 16000, currency: 'JPY', lastUpdated: '2025-07-16' }
    },
    
    bookingRules: {
      advanceBookingDays: 331,
      bookingDeadline: {
        web: '出発前日',
        phone: '出発前日'
      },
      changePolicy: 'allowed',
      cancellationFee: {
        domestic: '$200 USD',
        international: '$200 USD'
      }
    },
    
    japaneseSupport: {
      website: true,
      callCenter: false,
      notes: '日本語サイトあり、コールセンターは英語のみ'
    }
  }
};
