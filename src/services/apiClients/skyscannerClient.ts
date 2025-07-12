import { APIResponse, FlightSearchParams, UnifiedFlightOffer, SkyscannerResponse } from '../../types/api';

export class SkyscannerClient {
  private apiKey: string;
  private baseUrl = 'https://partners.api.skyscanner.net';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchFlights(params: FlightSearchParams): Promise<APIResponse<UnifiedFlightOffer[]>> {
    try {
      // フェーズ1: セッション作成
      const sessionResponse = await this.createSearchSession(params);
      if (!sessionResponse.success || !sessionResponse.data) {
        return {
          success: false,
          error: sessionResponse.error || {
            code: 'SKYSCANNER_SESSION_ERROR',
            message: 'セッション作成に失敗しました'
          }
        };
      }

      // フェーズ2: 結果ポーリング
      const results = await this.pollSearchResults(sessionResponse.data.sessionToken);
      return results;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SKYSCANNER_ERROR',
          message: error instanceof Error ? error.message : '不明なエラー',
          details: error
        }
      };
    }
  }

  private async createSearchSession(params: FlightSearchParams): Promise<APIResponse<{ sessionToken: string }>> {
    const searchPayload = {
      query: {
        market: 'JP',
        locale: 'ja-JP',
        currency: params.currency || 'JPY',
        queryLegs: [
          {
            originPlaceId: { iata: params.departure },
            destinationPlaceId: { iata: params.arrival },
            date: {
              year: new Date(params.departureDate).getFullYear(),
              month: new Date(params.departureDate).getMonth() + 1,
              day: new Date(params.departureDate).getDate()
            }
          }
        ],
        cabinClass: params.cabinClass.toUpperCase(),
        adults: params.passengers.adults,
        children: params.passengers.children || 0,
        infants: params.passengers.infants || 0
      }
    };

    const response = await fetch(`${this.baseUrl}/v3/flights/live/search/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify(searchPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const sessionToken = response.headers.get('x-session-id');
    if (!sessionToken) {
      throw new Error('レスポンスにセッショントークンが見つかりません');
    }

    return {
      success: true,
      data: { sessionToken }
    };
  }

  private async pollSearchResults(sessionToken: string): Promise<APIResponse<UnifiedFlightOffer[]>> {
    const maxAttempts = 10;
    const pollInterval = 1000; // 1秒間隔

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(`${this.baseUrl}/v3/flights/live/search/poll/${sessionToken}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SkyscannerResponse = await response.json();

      if (data.status === 'RESULT_STATUS_COMPLETE') {
        const unifiedOffers = this.transformToUnifiedFormat(data);
        return {
          success: true,
          data: unifiedOffers,
          rateLimit: {
            remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0'),
            resetTime: parseInt(response.headers.get('x-ratelimit-reset') || '0')
          }
        };
      }

      // 結果が不完全な場合は待機して再試行
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('最大試行回数を超えて検索がタイムアウトしました');
  }

  private transformToUnifiedFormat(data: SkyscannerResponse): UnifiedFlightOffer[] {
    return data.content.results.itineraries.map(itinerary => ({
      id: itinerary.id,
      source: 'skyscanner' as const,
      route: {
        departure: 'TBD', // 実際のレスポンス構造に応じて実装予定
        arrival: 'TBD',
        departureTime: 'TBD',
        arrivalTime: 'TBD'
      },
      pricing: {
        currency: 'JPY',
        totalPrice: parseInt(itinerary.pricingOptions[0]?.price.amount || '0'),
        basePrice: 0, // 計算が必要
        taxes: 0 // 計算が必要
      },
      airline: {
        code: 'TBD',
        name: 'TBD'
      },
      availability: {
        seats: 999, // スカイスキャナーでは通常提供されない情報
        bookingClass: 'Y'
      }
    }));
  }
}
