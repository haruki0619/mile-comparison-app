// 日本系航空会社のマイルデータ

// 基本的な型定義（簡略化）
interface MileRequirement {
  regular: number;
  discount?: number;
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
  domesticRoutes: Record<string, Record<string, MileRequirement>>;
  internationalRoutes: Record<string, Record<string, MileRequirement>>;
  fuelSurcharge: Record<string, FuelSurcharge>;
  bookingRules: BookingRules;
  japaneseSupport: JapaneseSupport;
}

export const JAPANESE_AIRLINES: Record<string, MileageProgram> = {
  // ANA マイレージクラブ
  ANA: {
    code: 'ANA',
    name: 'ANA Mileage Club',
    nameJa: 'ANAマイレージクラブ',
    alliance: 'Star Alliance',
    website: 'https://www.ana.co.jp/amc/',
    lastUpdated: '2025-07-16',
    
    dataQuality: {
      status: 'verified',
      source: 'official_pdf',
      lastVerified: '2025-07-16',
      notes: '公式PDFチャート（2024-10-29改定）で厳格検証済み'
    },
    
    domesticRoutes: {
      'HND-ITM': {
        economy: { regular: 10000 },
        premium: { regular: 15000 }
      },
      'HND-CTS': {
        economy: { regular: 12000 },
        premium: { regular: 18000 }
      },
      'HND-FUK': {
        economy: { regular: 12000 },
        premium: { regular: 18000 }
      },
      'HND-OKA': {
        economy: { regular: 14000 },
        premium: { regular: 21000 }
      }
    },
    
    internationalRoutes: {
      'NRT-LAX': {
        economy: { regular: 40000 },
        business: { regular: 85000 },
        first: { regular: 120000 }
      },
      'NRT-LHR': {
        economy: { regular: 45000 },
        business: { regular: 90000 },
        first: { regular: 120000 }
      },
      'NRT-SIN': {
        economy: { regular: 35000 },
        business: { regular: 60000 }
      }
    },
    
    fuelSurcharge: {
      'NRT-LAX': { amount: 0, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-LHR': { amount: 63000, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-SIN': { amount: 31000, currency: 'JPY', lastUpdated: '2025-07-16' }
    },
    
    bookingRules: {
      advanceBookingDays: 355,
      bookingDeadline: {
        web: '出発前日23:59',
        phone: '出発前日20:00'
      },
      changePolicy: 'allowed',
      cancellationFee: {
        domestic: '3,300円',
        international: '3,300円'
      }
    },
    
    japaneseSupport: {
      website: true,
      callCenter: true,
      notes: '完全日本語対応'
    }
  },

  // JAL マイレージバンク
  JAL: {
    code: 'JAL',
    name: 'JAL Mileage Bank',
    nameJa: 'JALマイレージバンク',
    alliance: 'oneworld',
    website: 'https://www.jal.co.jp/jmb/',
    lastUpdated: '2025-07-16',
    
    dataQuality: {
      status: 'verified',
      source: 'official_pdf',
      lastVerified: '2025-07-16',
      notes: '公式チャート（JGC会員向け資料含む）で厳格検証済み'
    },
    
    domesticRoutes: {
      'HND-ITM': {
        economy: { regular: 10000 },
        premium: { regular: 15000 }
      },
      'HND-CTS': {
        economy: { regular: 12000 },
        premium: { regular: 18000 }
      },
      'HND-FUK': {
        economy: { regular: 12000 },
        premium: { regular: 18000 }
      },
      'HND-OKA': {
        economy: { regular: 14000 },
        premium: { regular: 21000 }
      }
    },
    
    internationalRoutes: {
      'NRT-LAX': {
        economy: { regular: 40000 },
        business: { regular: 80000 },
        first: { regular: 100000 }
      },
      'NRT-LHR': {
        economy: { regular: 45000 },
        business: { regular: 85000 },
        first: { regular: 110000 }
      },
      'NRT-SIN': {
        economy: { regular: 35000 },
        business: { regular: 60000 }
      }
    },
    
    fuelSurcharge: {
      'NRT-LAX': { amount: 0, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-LHR': { amount: 63000, currency: 'JPY', lastUpdated: '2025-07-16' },
      'NRT-SIN': { amount: 31000, currency: 'JPY', lastUpdated: '2025-07-16' }
    },
    
    bookingRules: {
      advanceBookingDays: 330,
      bookingDeadline: {
        web: '出発96時間前',
        phone: '出発前日'
      },
      changePolicy: 'allowed',
      cancellationFee: {
        domestic: '3,300円',
        international: '3,300円'
      }
    },
    
    japaneseSupport: {
      website: true,
      callCenter: true,
      notes: '完全日本語対応'
    }
  }
};
