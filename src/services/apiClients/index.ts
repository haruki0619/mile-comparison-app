import { SkyscannerClient } from './skyscannerClient';
import { RakutenTravelClient } from './rakutenClient';
import { APIResponse, FlightSearchParams, UnifiedFlightOffer } from '../../types/api';

export class FlightAPIAggregator {
  private skyscannerClient?: SkyscannerClient;
  private rakutenClient?: RakutenTravelClient;

  constructor() {
    // 環境変数からAPIキーを取得
    const skyscannerKey = process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY;
    const rakutenAppId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;

    if (skyscannerKey) {
      this.skyscannerClient = new SkyscannerClient(skyscannerKey);
    }

    if (rakutenAppId) {
      this.rakutenClient = new RakutenTravelClient(rakutenAppId);
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<APIResponse<UnifiedFlightOffer[]>> {
    const results: UnifiedFlightOffer[] = [];
    const errors: string[] = [];

    // 並行してすべてのAPIを呼び出し
    const promises: Promise<APIResponse<UnifiedFlightOffer[]>>[] = [];

    if (this.skyscannerClient) {
      promises.push(this.skyscannerClient.searchFlights(params));
    }

    if (this.rakutenClient && this.isDomesticRoute(params)) {
      promises.push(this.rakutenClient.searchDomesticFlights(params));
    }

    // APIが設定されていない場合はモックデータを使用
    if (promises.length === 0) {
      console.warn('No API clients configured, using mock data');
      return this.getMockFlightData(params);
    }

    const responses = await Promise.allSettled(promises);

    for (const response of responses) {
      if (response.status === 'fulfilled' && response.value.success) {
        results.push(...(response.value.data || []));
      } else if (response.status === 'fulfilled' && response.value.error) {
        errors.push(response.value.error.message);
      } else if (response.status === 'rejected') {
        errors.push(response.reason?.message || 'Unknown error');
      }
    }

    // 結果をソート（価格順）
    results.sort((a, b) => a.pricing.totalPrice - b.pricing.totalPrice);

    return {
      success: results.length > 0,
      data: results,
      error: errors.length > 0 ? {
        code: 'PARTIAL_FAILURE',
        message: `Some APIs failed: ${errors.join(', ')}`,
        details: errors
      } : undefined
    };
  }

  private isDomesticRoute(params: FlightSearchParams): boolean {
    const domesticAirports = [
      'HND', 'NRT', 'KIX', 'ITM', 'NGO', 'FUK', 'SPK', 'CTS', 'KOJ', 
      'OKA', 'HIJ', 'KMI', 'TOY', 'NKM', 'AOM', 'SDJ', 'MSJ', 'OIT',
      'KMJ', 'UBJ', 'SHM', 'IWJ', 'HAC', 'WKJ', 'OGN', 'ISG', 'FKS'
    ];

    return domesticAirports.includes(params.departure) && 
           domesticAirports.includes(params.arrival);
  }

  private async getMockFlightData(params: FlightSearchParams): Promise<APIResponse<UnifiedFlightOffer[]>> {
    // 既存のモックデータロジックを使用
    const { searchFlights } = await import('../flightService');
    const mockResult = await searchFlights({
      departure: params.departure,
      arrival: params.arrival,
      date: params.departureDate,
      passengers: params.passengers.adults
    });

    const unifiedOffers: UnifiedFlightOffer[] = mockResult.airlines.map((airline, index) => ({
      id: `mock-${index}`,
      source: 'mock' as const,
      route: {
        departure: params.departure,
        arrival: params.arrival,
        departureTime: '08:00',
        arrivalTime: '10:00'
      },
      pricing: {
        currency: 'JPY',
        totalPrice: airline.cashPrice || 25000,
        basePrice: Math.floor((airline.cashPrice || 25000) * 0.85),
        taxes: Math.floor((airline.cashPrice || 25000) * 0.15)
      },
      airline: {
        code: airline.airline === 'ANA' ? 'NH' : airline.airline === 'JAL' ? 'JL' : '6J',
        name: airline.airline
      },
      availability: {
        seats: airline.availableSeats || 5,
        bookingClass: 'Y'
      },
      mileage: {
        requiredMiles: airline.miles.regular,
        season: 'regular',
        awardAvailable: (airline.availableSeats || 0) > 0
      }
    }));

    return {
      success: true,
      data: unifiedOffers
    };
  }
}

// シングルトンインスタンス
export const flightAPIAggregator = new FlightAPIAggregator();
