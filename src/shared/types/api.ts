// 🎯 API Layer Types - 外部APIとの境界定義
import { Flight, SearchCriteria } from './domain';

export interface APIClient {
  readonly name: string;
  readonly version: string;
  search(criteria: SearchCriteria): Promise<APIResponse<Flight[]>>;
  healthCheck(): Promise<APIHealthStatus>;
}

export interface APIResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: APIError;
  readonly metadata?: ResponseMetadata;
}

export interface APIError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp?: Date;
}

export interface ResponseMetadata {
  readonly requestId: string;
  readonly timestamp: Date;
  readonly executionTime: number;
  readonly source: DataSource;
  readonly cached?: boolean;
}

export type DataSource = 'api' | 'cache' | 'fallback' | 'mock';
export type ErrorCode = 
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'CORS_ERROR'
  | 'AUTH_ERROR'
  | 'RATE_LIMIT'
  | 'INVALID_REQUEST'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN_ERROR';

export interface APIHealthStatus {
  readonly isHealthy: boolean;
  readonly responseTime: number;
  readonly lastChecked: Date;
  readonly issues?: string[];
}

// 🎯 Provider-specific Response Types
export interface RakutenAPIResponse {
  readonly Items?: RakutenFlightItem[];
  readonly pageCount?: number;
  readonly hits?: number;
}

export interface RakutenFlightItem {
  readonly flightInfo: {
    readonly departureAirport: string;
    readonly arrivalAirport: string;
    readonly departureTime: string;
    readonly arrivalTime: string;
    readonly airline: string;
  };
  readonly price: {
    readonly adult: number;
    readonly currency: string;
  };
}

export interface AmadeusAPIResponse {
  readonly data?: AmadeusFlightOffer[];
  readonly dictionaries?: {
    readonly carriers: Record<string, string>;
    readonly aircraft: Record<string, string>;
  };
}

export interface AmadeusFlightOffer {
  readonly id: string;
  readonly itineraries: AmadeusItinerary[];
  readonly price: {
    readonly total: string;
    readonly currency: string;
    readonly base?: string;
    readonly taxes?: AmadeusTax[];
  };
  readonly validatingAirlineCodes: string[];
}

export interface AmadeusItinerary {
  readonly segments: AmadeusSegment[];
  readonly duration: string;
}

export interface AmadeusSegment {
  readonly departure: {
    readonly iataCode: string;
    readonly at: string;
  };
  readonly arrival: {
    readonly iataCode: string;
    readonly at: string;
  };
  readonly carrierCode: string;
  readonly number: string;
  readonly aircraft: {
    readonly code: string;
  };
}

export interface AmadeusTax {
  readonly amount: string;
  readonly code: string;
}
