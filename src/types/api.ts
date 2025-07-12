// API統合のための型定義
export interface APIConfig {
  skyscanner: {
    apiKey: string;
    baseUrl: string;
  };
  rakuten: {
    appId: string;
    baseUrl: string;
  };
  amadeus: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
  };
}

// 統一されたフライトデータ形式
export interface UnifiedFlightOffer {
  id: string;
  source: 'skyscanner' | 'rakuten' | 'amadeus' | 'mock';
  route: {
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
  };
  pricing: {
    currency: string;
    totalPrice: number;
    basePrice: number;
    taxes: number;
  };
  airline: {
    code: string;
    name: string;
  };
  availability: {
    seats: number;
    bookingClass: string;
  };
  mileage?: {
    requiredMiles: number;
    season: 'peak' | 'regular' | 'off';
    awardAvailable: boolean;
  };
}

// API呼び出し結果
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

// 検索パラメータ
export interface FlightSearchParams {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabinClass: 'economy' | 'premium' | 'business' | 'first';
  currency: string;
}

// スカイスキャナーAPI特有の型
export interface SkyscannerResponse {
  sessionToken: string;
  status: 'RESULT_STATUS_COMPLETE' | 'RESULT_STATUS_INCOMPLETE';
  content: {
    results: {
      itineraries: SkyscannerItinerary[];
    };
  };
}

export interface SkyscannerItinerary {
  id: string;
  pricingOptions: Array<{
    price: {
      amount: string;
      unit: string;
    };
    agentIds: string[];
  }>;
  legIds: string[];
}

// 楽天トラベルAPI特有の型
export interface RakutenTravelResponse {
  pagingInfo: {
    recordCount: number;
    pageCount: number;
    page: number;
    first: number;
    last: number;
  };
  flights: RakutenFlight[];
}

export interface RakutenFlight {
  flightNo: string;
  airline: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  price: number;
  availableSeats: number;
}
