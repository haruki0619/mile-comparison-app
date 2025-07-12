import { SkyscannerClient } from './skyscannerClient';
import { RakutenTravelClient } from './rakutenClient';
import { APIResponse, FlightSearchParams, UnifiedFlightOffer } from '../../types/api';

export class FlightAPIAggregator {
  private skyscannerClient?: SkyscannerClient;
  private rakutenClient?: RakutenTravelClient;

  constructor() {
    // 環境変数からAPIキーを取得
    const rakutenAppId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;

    // Skyscanner APIは商用利用のみのため一時的に無効化
    // const skyscannerKey = process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY;
    // if (skyscannerKey) {
    //   this.skyscannerClient = new SkyscannerClient(skyscannerKey);
    // }

    if (rakutenAppId) {
      this.rakutenClient = new RakutenTravelClient(rakutenAppId);
      console.log('✅ 楽天トラベルAPIクライアント初期化完了');
    } else {
      console.warn('⚠️ 楽天トラベルAPIキーが設定されていません。モックデータを使用します。');
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<APIResponse<UnifiedFlightOffer[]>> {
    const results: UnifiedFlightOffer[] = [];
    const errors: string[] = [];

    // 楽天トラベルAPIを優先して使用（国内線の場合）
    if (this.rakutenClient && this.isDomesticRoute(params)) {
      console.log('🔍 楽天トラベルAPIで国内線検索中...');
      try {
        const rakutenResponse = await this.rakutenClient.searchDomesticFlights(params);
        if (rakutenResponse.success && rakutenResponse.data) {
          results.push(...rakutenResponse.data);
          console.log(`✅ 楽天トラベルAPI: ${rakutenResponse.data.length}件の結果を取得`);
        } else if (rakutenResponse.error) {
          errors.push(`楽天トラベルAPI: ${rakutenResponse.error.message}`);
        }
      } catch (error) {
        errors.push(`楽天トラベルAPI例外: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Skyscanner APIは一時的に無効化（商用利用制限のため）
    // if (this.skyscannerClient) {
    //   promises.push(this.skyscannerClient.searchFlights(params));
    // }

    // 実データが取得できない場合はモックデータを使用
    if (results.length === 0) {
      console.warn('⚠️ 実データAPIが利用できません。モックデータを使用します。');
      return this.getMockFlightData(params);
    }

    // 結果をソート（価格順）
    results.sort((a, b) => a.pricing.totalPrice - b.pricing.totalPrice);

    return {
      success: results.length > 0,
      data: results,
      error: errors.length > 0 ? {
        code: 'PARTIAL_FAILURE',
        message: `一部のAPIでエラーが発生: ${errors.join(', ')}`,
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
