// 航空会社予約システム統合のための型定義とヘルパー

export interface BookingSystemConfig {
  // 基本設定
  airline: string;
  airlineCode: string;
  
  // URL構造
  urls: {
    base: string;
    search: string;
    award?: string;  // マイル特典航空券用
  };
  
  // URLパラメータマッピング（調査結果に基づく柔軟な定義）
  parameters: {
    origin: string;           // 'from', 'departure', 'orig', 'N/A'等
    destination: string;      // 'to', 'arrival', 'dest', 'N/A'等
    departureDate: string;    // 'outboundDate', 'depDate', 'N/A'等
    returnDate?: string;      // 'inboundDate', 'retDate', 'N/A'等
    adults: string;           // 'adults', 'ADT', 'N/A'等
    children?: string;        // 'children', 'CHD', 'N/A'等
    infants?: string;         // 'infants', 'INF', 'N/A'等
    cabinClass: string;       // 'class', 'cabin', 'N/A'等
    flightNumber?: string;    // 'flight', 'flightNo', 'N/A'等
    redemptionType?: string;  // 'paymentType', 'redeemMiles', 'N/A'等
    
    // 調査で確認された特殊パラメータ
    awardTravel?: string;     // Delta専用: 'awardTravel'
    apiOriginCode?: string;   // Lufthansa API専用
    apiDestinationCode?: string;
    apiTravelDate?: string;
    apiCabinClass?: string;
    apiTravelers?: string;
  };
  
  // データ形式
  formats: {
    dateFormat: string;       // 'YYYY-MM-DD', 'MM/DD/YYYY'等
    airportCodeFormat: 'IATA' | 'ICAO';
    classMapping: {
      economy: string;        // 'Y', 'ECONOMY', 'ECO'等
      premiumEconomy?: string; // 'W', 'PREMIUM_ECONOMY'等
      business: string;       // 'C', 'BUSINESS', 'BIZ'等
      first?: string;         // 'F', 'FIRST'等
    };
  };
  
  // 制約事項
  constraints: {
    loginRequired: boolean;
    externalLinkAllowed: boolean;
    maxAdvanceBookingDays: number;
    minAdvanceBookingDays: number;
    supportedRoutes: 'domestic' | 'international' | 'both';
    supportsSpecificFlight: boolean;
    supportsSpecificTime: boolean;
  };
  
  // 検証情報
  verification: {
    lastVerified: string;     // ISO date string
    verifiedRoutes: string[]; // ['NRT-LAX', 'HND-SIN']等
    verificationMethod: string;
    verifiedBy: string;
  };
}

// 予約URL生成用の入力パラメータ
export interface BookingRequest {
  airline: string;
  route: {
    departure: string;        // IATA code
    arrival: string;          // IATA code
  };
  dates: {
    departure: string;        // ISO date string
    return?: string;          // ISO date string (往復の場合)
  };
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  preferences: {
    cabinClass: 'economy' | 'premiumEconomy' | 'business' | 'first';
    flightNumber?: string;
    departureTime?: string;   // HH:MM format
    redemptionType?: 'cash' | 'miles';
  };
  tracking?: {
    referralCode?: string;
    affiliateId?: string;
    campaignId?: string;
  };
}

// 生成されたURL情報
export interface GeneratedBookingUrl {
  url: string;
  isValid: boolean;
  warnings: string[];
  metadata: {
    airline: string;
    generatedAt: string;
    expiresAt?: string;
    requiresLogin: boolean;
    supportedFeatures: string[];
  };
}

// 航空会社設定（2025年7月16日調査結果に基づく）
export const AIRLINE_CONFIGS: Record<string, BookingSystemConfig> = {
  // 国内航空会社（調査済み・POST方式のため検索フォームページにリダイレクト）
  'ANA': {
    airline: 'All Nippon Airways',
    airlineCode: 'NH',
    urls: {
      base: 'https://www.ana.co.jp',
      search: 'https://www.ana.co.jp/en/us/plan-book/',
      award: 'https://www.ana.co.jp/en/us/amc/international-flight-awards/'
    },
    parameters: {
      // POST方式のため、URLパラメータ不可
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      returnDate: 'N/A',
      adults: 'N/A',
      children: 'N/A',
      infants: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        premiumEconomy: 'POST_FORM',
        business: 'POST_FORM',
        first: 'POST_FORM'
      }
    },
    constraints: {
      loginRequired: true, // Award検索にはAMCログイン必須
      externalLinkAllowed: false, // POST方式のため直接リンク不可
      maxAdvanceBookingDays: 330,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['確認不可（POST方式）'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },
  
  'JAL': {
    airline: 'Japan Airlines',
    airlineCode: 'JL',
    urls: {
      base: 'https://www.jal.co.jp',
      search: 'https://sp.jal.co.jp/en/',
      award: 'https://sp.jal.co.jp/en/jmb/award_inter/booking/'
    },
    parameters: {
      // POST方式のため、URLパラメータ不可
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      returnDate: 'N/A',
      adults: 'N/A',
      children: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        business: 'POST_FORM',
        first: 'POST_FORM'
      }
    },
    constraints: {
      loginRequired: true, // 発券にはJMBログイン必須
      externalLinkAllowed: false, // POST方式のため直接リンク不可
      maxAdvanceBookingDays: 330,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['確認不可（POST方式）'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },

  'SKY': {
    airline: 'Skymark Airlines',
    airlineCode: 'BC',
    urls: {
      base: 'https://www.skymark.co.jp',
      search: 'https://www.res.skymark.co.jp/reserve2/main?language=en'
    },
    parameters: {
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      adults: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        business: 'POST_FORM' // 必須プロパティを追加
    }
    },
    constraints: {
      loginRequired: false,
      externalLinkAllowed: false,
      maxAdvanceBookingDays: 60,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'domestic',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['確認不可（POST方式）'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },

  // 海外航空会社（調査済み・一部例外除きPOST方式）
  'UNITED': {
    airline: 'United Airlines',
    airlineCode: 'UA',
    urls: {
      base: 'https://www.united.com',
      search: 'https://www.united.com/en/us/book-flight/united-reservations/',
      award: 'https://www.united.com/en/us/book-flight/united-award-travel'
    },
    parameters: {
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      returnDate: 'N/A',
      adults: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        premiumEconomy: 'POST_FORM',
        business: 'POST_FORM',
        first: 'POST_FORM'
      }
    },
    constraints: {
      loginRequired: true, // 発券にはMileagePlusログイン必須
      externalLinkAllowed: false,
      maxAdvanceBookingDays: 337,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['確認不可（POST方式）'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },

  'DELTA': {
    airline: 'Delta Air Lines',
    airlineCode: 'DL',
    urls: {
      base: 'https://www.delta.com',
      search: 'https://www.delta.com/flight-search/book-a-flight',
      award: 'https://www.delta.com/flight-search/book-a-flight?awardTravel=true'
    },
    parameters: {
      // Deltaは唯一awardTravelパラメータが確認できた
      awardTravel: 'awardTravel',
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      adults: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        premiumEconomy: 'POST_FORM',
        business: 'POST_FORM',
        first: 'POST_FORM'
      }
    },
    constraints: {
      loginRequired: true, // 発券にはSkyMilesログイン必須
      externalLinkAllowed: true, // awardTravelパラメータのみ
      maxAdvanceBookingDays: 331,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['awardTravel=true パラメータのみ確認'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },

  'LUFTHANSA': {
    airline: 'Lufthansa',
    airlineCode: 'LH',
    urls: {
      base: 'https://www.lufthansa.com',
      search: 'https://www.lufthansa.com/us/en/flight-search',
      award: 'https://www.lufthansa.com/us/en/cash-and-miles'
    },
    parameters: {
      // Lufthansa API経由でのみパラメータ指定可能
      origin: 'N/A',
      destination: 'N/A', 
      departureDate: 'N/A',
      adults: 'N/A',
      cabinClass: 'N/A',
      apiOriginCode: 'originCode',
      apiDestinationCode: 'destinationCode',
      apiTravelDate: 'travelDate',
      apiCabinClass: 'cabinClass',
      apiTravelers: 'travelers'
    },
    formats: {
      dateFormat: 'YYYY-MM-DD',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'economy',
        premiumEconomy: 'premium_economy',
        business: 'business',
        first: 'first'
      }
    },
    constraints: {
      loginRequired: true,
      externalLinkAllowed: true, // API経由でのみ
      maxAdvanceBookingDays: 361,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['API経由でパラメータ確認'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },

  // IATAコードエイリアス（APIから返される可能性のあるコード）
  'NH': {
    airline: 'All Nippon Airways',
    airlineCode: 'NH',
    urls: {
      base: 'https://www.ana.co.jp',
      search: 'https://www.ana.co.jp/en/us/plan-book/',
      award: 'https://www.ana.co.jp/en/us/amc/international-flight-awards/'
    },
    parameters: {
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      returnDate: 'N/A',
      adults: 'N/A',
      children: 'N/A',
      infants: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        premiumEconomy: 'POST_FORM',
        business: 'POST_FORM',
        first: 'POST_FORM'
      }
    },
    constraints: {
      loginRequired: true,
      externalLinkAllowed: false,
      maxAdvanceBookingDays: 330,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['確認不可（POST方式）'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  },

  'JL': {
    airline: 'Japan Airlines',
    airlineCode: 'JL',
    urls: {
      base: 'https://www.jal.co.jp',
      search: 'https://sp.jal.co.jp/en/',
      award: 'https://sp.jal.co.jp/en/jmb/award_inter/booking/'
    },
    parameters: {
      origin: 'N/A',
      destination: 'N/A',
      departureDate: 'N/A',
      returnDate: 'N/A',
      adults: 'N/A',
      children: 'N/A',
      cabinClass: 'N/A'
    },
    formats: {
      dateFormat: 'POST_FORM',
      airportCodeFormat: 'IATA',
      classMapping: {
        economy: 'POST_FORM',
        business: 'POST_FORM',
        first: 'POST_FORM'
      }
    },
    constraints: {
      loginRequired: true,
      externalLinkAllowed: false,
      maxAdvanceBookingDays: 330,
      minAdvanceBookingDays: 1,
      supportedRoutes: 'both',
      supportsSpecificFlight: false,
      supportsSpecificTime: false
    },
    verification: {
      lastVerified: '2025-07-16T00:00:00Z',
      verifiedRoutes: ['確認不可（POST方式）'],
      verificationMethod: 'Step1-4_completed',
      verifiedBy: 'ai_research'
    }
  }
};

// URL生成ヘルパー関数
export class BookingUrlGenerator {
  
  static generateUrl(request: BookingRequest): GeneratedBookingUrl {
    const config = AIRLINE_CONFIGS[request.airline];
    
    if (!config) {
      return {
        url: '',
        isValid: false,
        warnings: [`航空会社 ${request.airline} の設定が見つかりません`],
        metadata: {
          airline: request.airline,
          generatedAt: new Date().toISOString(),
          requiresLogin: false,
          supportedFeatures: []
        }
      };
    }
    
    const warnings: string[] = [];
    let targetUrl = '';
    
    // 調査結果に基づく現実的なURL生成
    if (request.preferences.redemptionType === 'miles' && config.urls.award) {
      // マイル特典航空券の場合
      targetUrl = config.urls.award;
      
      // Delta の特殊ケース：awardTravel パラメータが使用可能
      if (request.airline === 'DELTA' && config.parameters.awardTravel) {
        const deltaUrl = new URL(config.urls.award);
        deltaUrl.searchParams.set('awardTravel', 'true');
        targetUrl = deltaUrl.toString();
      }
      
      if (config.constraints.loginRequired) {
        warnings.push('マイル特典航空券の予約には会員ログインが必要です');
      }
    } else {
      // 通常予約の場合
      targetUrl = config.urls.search;
    }
    
    // POST方式の航空会社への対応
    if (!config.constraints.externalLinkAllowed) {
      warnings.push('この航空会社は外部からの直接リンクをサポートしていません。検索フォームページに遷移します。');
    }
    
    // 特殊ケース：Lufthansa API対応
    if (request.airline === 'LUFTHANSA') {
      warnings.push('Lufthansaは Partner Deeplinks API での実装を推奨します。現在は検索ページにリダイレクトします。');
    }
    
    // 日付の妥当性チェック
    const depDate = new Date(request.dates.departure);
    const today = new Date();
    const diffDays = Math.ceil((depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < config.constraints.minAdvanceBookingDays) {
      warnings.push(`出発日まで ${diffDays} 日しかありません。最低 ${config.constraints.minAdvanceBookingDays} 日前の予約が必要です。`);
    }
    
    if (diffDays > config.constraints.maxAdvanceBookingDays) {
      warnings.push(`出発日まで ${diffDays} 日あります。最大 ${config.constraints.maxAdvanceBookingDays} 日前までの予約が可能です。`);
    }
    
    // トラッキングパラメータ（サポートしている場合のみ）
    if (request.tracking && config.constraints.externalLinkAllowed) {
      const url = new URL(targetUrl);
      if (request.tracking.referralCode) {
        url.searchParams.set('ref', request.tracking.referralCode);
      }
      if (request.tracking.affiliateId) {
        url.searchParams.set('aff', request.tracking.affiliateId);
      }
      targetUrl = url.toString();
    }
    
    return {
      url: targetUrl,
      isValid: true,
      warnings,
      metadata: {
        airline: config.airline,
        generatedAt: new Date().toISOString(),
        requiresLogin: config.constraints.loginRequired,
        supportedFeatures: this.getSupportedFeatures(config)
      }
    };
  }
  
  private static formatDate(isoDate: string, format: string): string {
    const date = new Date(isoDate);
    const isoString = date.toISOString();
    const datePart = isoString.split('T')[0];
    
    if (!datePart) {
      throw new Error('Invalid date format');
    }
    
    switch (format) {
      case 'YYYY-MM-DD':
        return datePart;
      case 'YYYYMMDD':
        return datePart.replace(/-/g, '');
      case 'MM/DD/YYYY':
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      default:
        return datePart;
    }
  }
  
  private static getSupportedFeatures(config: BookingSystemConfig): string[] {
    const features: string[] = [];
    
    if (config.constraints.supportsSpecificFlight) features.push('specific_flight');
    if (config.constraints.supportsSpecificTime) features.push('specific_time');
    if (config.urls.award) features.push('mile_redemption');
    if (config.constraints.externalLinkAllowed) features.push('external_linking');
    
    return features;
  }
  
  // 設定の検証
  static validateConfig(airlineCode: string): boolean {
    const config = AIRLINE_CONFIGS[airlineCode];
    return !!(config && config.verification.lastVerified !== '');
  }
  
  // 設定の更新（新しい調査結果で更新）
  static updateConfig(airlineCode: string, newConfig: Partial<BookingSystemConfig>): void {
    if (AIRLINE_CONFIGS[airlineCode]) {
      AIRLINE_CONFIGS[airlineCode] = { 
        ...AIRLINE_CONFIGS[airlineCode], 
        ...newConfig,
        verification: {
          ...AIRLINE_CONFIGS[airlineCode].verification,
          lastVerified: new Date().toISOString(),
          ...newConfig.verification
        }
      };
    }
  }
}

// 使用例（2025年7月16日調査結果に基づく現実的な例）
/*
// 基本使用例（ANA現金予約）
const bookingRequest: BookingRequest = {
  airline: 'ANA',
  route: {
    departure: 'NRT',
    arrival: 'LAX'
  },
  dates: {
    departure: '2025-10-15'
  },
  passengers: {
    adults: 1
  },
  preferences: {
    cabinClass: 'economy',
    redemptionType: 'cash'
  }
};

const result = BookingUrlGenerator.generateUrl(bookingRequest);
console.log(result.url);
// https://www.ana.co.jp/en/us/plan-book/ (検索フォームページ)
console.log(result.warnings);
// ["この航空会社は外部からの直接リンクをサポートしていません。検索フォームページに遷移します。"]

// マイル特典例（JAL）
const mileBookingRequest: BookingRequest = {
  airline: 'JAL',
  route: { departure: 'HND', arrival: 'SIN' },
  dates: { departure: '2025-12-01' },
  passengers: { adults: 2 },
  preferences: { cabinClass: 'business', redemptionType: 'miles' }
};

const mileResult = BookingUrlGenerator.generateUrl(mileBookingRequest);
console.log(mileResult.url);
// https://sp.jal.co.jp/en/jmb/award_inter/booking/
console.log(mileResult.warnings);
// ["マイル特典航空券の予約には会員ログインが必要です", "この航空会社は外部からの直接リンクをサポートしていません..."]

// Delta（特殊パラメータサポート例）
const deltaRequest: BookingRequest = {
  airline: 'DELTA',
  route: { departure: 'NRT', arrival: 'SEA' },
  dates: { departure: '2025-11-20' },
  passengers: { adults: 1 },
  preferences: { cabinClass: 'economy', redemptionType: 'miles' }
};

const deltaResult = BookingUrlGenerator.generateUrl(deltaRequest);
console.log(deltaResult.url);
// https://www.delta.com/flight-search/book-a-flight?awardTravel=true&ref=mile-compass&aff=MC001

*/
