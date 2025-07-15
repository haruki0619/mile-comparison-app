// 🎯 Domain Types - ビジネスドメインの核となる型定義
export interface Flight {
  readonly id: string;
  readonly route: Route;
  readonly schedule: FlightSchedule;
  readonly pricing: FlightPricing;
  readonly airline: Airline;
  readonly availability: SeatAvailability;
}

export interface Route {
  readonly departure: AirportCode;
  readonly arrival: AirportCode;
  readonly distance?: number;
}

export interface FlightSchedule {
  readonly departureTime: string; // ISO 8601 time format
  readonly arrivalTime: string;
  readonly duration?: string;
  readonly timezone?: string;
}

export interface FlightPricing {
  readonly currency: CurrencyCode;
  readonly basePrice: number;
  readonly taxes: number;
  readonly totalPrice: number;
  readonly fees?: FlightFee[];
}

export interface FlightFee {
  readonly type: 'fuel' | 'security' | 'service' | 'other';
  readonly amount: number;
  readonly description?: string;
}

export interface Airline {
  readonly code: AirlineCode;
  readonly name: string;
  readonly alliance?: 'OneWorld' | 'StarAlliance' | 'SkyTeam';
}

export interface SeatAvailability {
  readonly availableSeats: number;
  readonly bookingClass: BookingClass;
  readonly isAvailable: boolean;
}

// 🎯 Value Objects
export type AirportCode = string; // IATA 3-letter code
export type AirlineCode = string; // IATA 2-letter code  
export type CurrencyCode = 'JPY' | 'USD' | 'EUR';
export type BookingClass = 'Y' | 'B' | 'M' | 'H' | 'Q' | 'V' | 'W' | 'S' | 'T' | 'L' | 'A' | 'D' | 'Z' | 'P' | 'O' | 'I' | 'U' | 'E' | 'X';

// 🎯 Mile Domain Types
export interface MileProgram {
  readonly programId: string;
  readonly airline: Airline;
  readonly programName: string;
  readonly alliance?: string;
  readonly partners: string[];
}

export interface MileRequirement {
  readonly route: Route;
  readonly cabinClass: CabinClass;
  readonly season: Season;
  readonly requiredMiles: number;
  readonly taxes: number;
  readonly availability: AvailabilityStatus;
}

export type CabinClass = 'economy' | 'premium' | 'business' | 'first';
export type Season = 'regular' | 'peak' | 'off';
export type AvailabilityStatus = 'available' | 'waitlist' | 'unavailable';

// 🎯 Search Domain Types
export interface SearchCriteria {
  readonly route: Route;
  readonly departureDate: Date;
  readonly returnDate?: Date;
  readonly passengers: PassengerCount;
  readonly cabinClass: CabinClass;
  readonly preferences?: SearchPreferences;
}

export interface PassengerCount {
  readonly adults: number;
  readonly children: number;
  readonly infants: number;
}

export interface SearchPreferences {
  readonly directFlightsOnly?: boolean;
  readonly preferredAirlines?: AirlineCode[];
  readonly maxStops?: number;
  readonly timeOfDayPreference?: TimePreference;
}

export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
