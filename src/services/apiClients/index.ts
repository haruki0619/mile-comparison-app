import { RakutenTravelClient } from './rakutenClient';
import { AmadeusClient } from './amadeusClient';
import { APIResponse, FlightSearchParams, UnifiedFlightOffer } from '../../types/api';

export class FlightAPIAggregator {
  private rakutenClient?: RakutenTravelClient;
  private amadeusClient?: AmadeusClient;

  constructor() {
    // 環境変数からAPIキーを取得
    const rakutenAppId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
    const rakutenSecret = process.env.NEXT_PUBLIC_RAKUTEN_APPLICATION_SECRET;
    const rakutenAffiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
    
    const amadeusClientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

    if (rakutenAppId && rakutenSecret && rakutenAffiliateId) {
      this.rakutenClient = new RakutenTravelClient(rakutenAppId, rakutenSecret, rakutenAffiliateId);
      console.log('✅ 楽天トラベルAPIクライアント初期化完了');
    } else {
      console.warn('⚠️ 楽天トラベルAPI認証情報が不完全です。モックデータを使用します。');
    }

    if (amadeusClientId && amadeusClientSecret) {
      this.amadeusClient = new AmadeusClient(amadeusClientId, amadeusClientSecret);
      console.log('✅ Amadeus APIクライアント初期化完了');
    } else {
      console.warn('⚠️ Amadeus API認証情報が設定されていません。');
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<APIResponse<UnifiedFlightOffer[]>> {
    const results: UnifiedFlightOffer[] = [];
    const errors: string[] = [];

    // 楽天トラベルAPIを優先して使用（国内線の場合）
    // TODO: 型エラー解決後に復活
    /*
    if (this.rakutenClient && this.isDomesticRoute(params)) {
      console.log('🔍 楽天トラベルAPIで国内線検索中...');
      try {
        const rakutenResponse = await this.rakutenClient.search({
          route: { departure: params.departure, arrival: params.arrival },
          departureDate: new Date(params.departureDate),
          passengers: { adults: params.passengers.adults },
          cabinClass: params.cabinClass
        });
        if (rakutenResponse.success && rakutenResponse.data) {
          // Flight型をUnifiedFlightOffer型に変換
          const convertedFlights = rakutenResponse.data.map(flight => ({
            ...flight,
            source: 'rakuten' as const
          }));
          results.push(...convertedFlights);
          console.log(`✅ 楽天トラベルAPI: ${rakutenResponse.data.length}件の結果を取得`);
        } else if (rakutenResponse.error) {
          errors.push(`楽天トラベルAPI: ${rakutenResponse.error.message}`);
        }
      } catch (error) {
        errors.push(`楽天トラベルAPI例外: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    */

    // Amadeus APIを使用（国内線・国際線両方対応）
    if (this.amadeusClient) {
      console.log('🔍 Amadeus APIで航空券検索中...');
      try {
        const amadeusResponse = await this.amadeusClient.searchFlights(params);
        if (amadeusResponse.success && amadeusResponse.data) {
          results.push(...amadeusResponse.data);
          console.log(`✅ Amadeus API: ${amadeusResponse.data.length}件の結果を取得`);
        } else if (amadeusResponse.error) {
          errors.push(`Amadeus API: ${amadeusResponse.error.message}`);
        }
      } catch (error) {
        errors.push(`Amadeus API例外: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

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

    const unifiedOffers: UnifiedFlightOffer[] = (mockResult.airlines || []).map((airline, index) => ({
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
