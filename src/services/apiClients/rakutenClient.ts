// 🎯 Improved Rakuten Travel API Client
import { BaseAPIClient } from '../../shared/clients/BaseAPIClient';
import { APIResponse } from '../../shared/types/api';
import { Flight, SearchCriteria, Route, FlightSchedule, FlightPricing, Airline, SeatAvailability } from '../../shared/types/domain';
import { APIUtils, PriceUtils, DateTimeUtils } from '../../shared/utils/apiUtils';

export class RakutenTravelClient extends BaseAPIClient {
  readonly name = 'Rakuten Travel';
  readonly version = '2.0';
  
  private readonly appId: string;
  private readonly applicationSecret: string;
  private readonly affiliateId: string;

  constructor(appId: string, applicationSecret: string, affiliateId: string) {
    super('https://app.rakuten.co.jp/services/api/Travel', 8000, 2);
    this.appId = appId;
    this.applicationSecret = applicationSecret;
    this.affiliateId = affiliateId;
  }

  /**
   * 統一検索インターフェース実装
   */
  async search(criteria: SearchCriteria): Promise<APIResponse<Flight[]>> {
    console.log('� 楽天トラベル検索開始:', criteria);
    return this.safeSearch(criteria);
  }

  /**
   * 実際の楽天API検索処理
   */
  protected async performSearch(criteria: SearchCriteria): Promise<Flight[]> {
    // CORS制限により、ブラウザからの直接API呼び出しは制限される
    // 本番環境ではserver-side proxyを使用すること
    throw new Error('CORS_ERROR: Browser direct API call blocked');
  }

  /**
   * フォールバックデータ生成（推定データ）
   */
  protected async generateFallbackData(criteria: SearchCriteria): Promise<Flight[]> {
    console.log('📊 楽天推定データを生成中...');
    
    const routePricing = this.getEstimatedPricing(criteria.route);
    const mockAirlines = this.getDomesticAirlines();
    const flightTimes = this.generateFlightTimes();
    
    return mockAirlines.map((airline, index) => {
      const timeSlot = flightTimes[index % flightTimes.length];
      if (!timeSlot) {
        throw new Error('Invalid flight time slot');
      }
      
      const priceVariation = index * 2000;
      
      return this.createFlightOffer(
        criteria.route,
        timeSlot,
        routePricing,
        airline,
        priceVariation,
        index
      );
    });
  }

  /**
   * フライトオファー作成
   */
  private createFlightOffer(
    route: Route,
    timeSlot: { departure: string; arrival: string },
    basePricing: { base: number; taxes: number },
    airline: { code: string; name: string; alliance?: string },
    priceVariation: number,
    index: number
  ): Flight {
    const basePrice = basePricing.base + priceVariation;
    const taxes = basePricing.taxes;
    
    return {
      id: `rakuten-est-${index + 1}-${Date.now()}`,
      route,
      schedule: {
        departureTime: timeSlot.departure,
        arrivalTime: timeSlot.arrival,
        duration: DateTimeUtils.calculateFlightDuration(timeSlot.departure, timeSlot.arrival)
      },
      pricing: {
        currency: 'JPY',
        basePrice,
        taxes,
        totalPrice: PriceUtils.calculateTotalPrice(basePrice, taxes)
      },
      airline: {
        code: airline.code,
        name: airline.name,
        ...(airline.alliance && { alliance: airline.alliance as 'OneWorld' | 'StarAlliance' | 'SkyTeam' })
      },
      availability: {
        availableSeats: Math.floor(Math.random() * 10) + 1,
        bookingClass: 'Y',
        isAvailable: true
      }
    };
  }

  /**
   * 国内線航空会社データ
   */
  private getDomesticAirlines() {
    return [
      { code: 'NH', name: 'ANA', alliance: 'StarAlliance' },
      { code: 'JL', name: 'JAL', alliance: 'OneWorld' },
      { code: 'SNA', name: 'ソラシドエア' },
      { code: 'BC', name: 'スカイマーク' },
      { code: 'MM', name: 'ピーチ' },
      { code: '3K', name: 'ジェットスター' }
    ];
  }

  /**
   * フライト時刻生成
   */
  private generateFlightTimes() {
    return [
      { departure: '08:00', arrival: '10:30' },
      { departure: '12:00', arrival: '14:30' },
      { departure: '16:00', arrival: '18:30' },
      { departure: '19:00', arrival: '21:30' },
      { departure: '06:30', arrival: '09:00' },
      { departure: '21:30', arrival: '24:00' }
    ];
  }

  /**
   * ルート別推定価格
   */
  private getEstimatedPricing(route: Route): { base: number; taxes: number } {
    const routePrices: { [key: string]: { base: number; taxes: number } } = {
      'NRT-KIX': { base: 22000, taxes: 3000 },
      'NRT-ITM': { base: 21000, taxes: 2800 },
      'NRT-CTS': { base: 32000, taxes: 4000 },
      'NRT-FUK': { base: 35000, taxes: 4500 },
      'HND-KIX': { base: 23000, taxes: 3100 },
      'HND-ITM': { base: 22000, taxes: 2900 },
      'HND-CTS': { base: 33000, taxes: 4100 },
      'HND-FUK': { base: 36000, taxes: 4600 },
      'ITM-CTS': { base: 45000, taxes: 5500 },
      'KIX-CTS': { base: 44000, taxes: 5400 }
    };
    
    const key = `${route.departure}-${route.arrival}`;
    const reverseKey = `${route.arrival}-${route.departure}`;
    
    return routePrices[key] || routePrices[reverseKey] || { base: 25000, taxes: 3500 };
  }
}
