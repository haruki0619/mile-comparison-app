import { APIResponse, FlightSearchParams, UnifiedFlightOffer, RakutenTravelResponse } from '../../types/api';

export class RakutenTravelClient {
  private appId: string;
  private baseUrl = 'https://app.rakuten.co.jp/services/api/Travel';

  constructor(appId: string) {
    this.appId = appId;
  }

  async searchDomesticFlights(params: FlightSearchParams): Promise<APIResponse<UnifiedFlightOffer[]>> {
    try {
      const searchParams = new URLSearchParams({
        applicationId: this.appId,
        format: 'json',
        departure: params.departure,
        arrival: params.arrival,
        outwardDate: params.departureDate,
        ...(params.returnDate && { returnDate: params.returnDate }),
        adultNum: params.passengers.adults.toString(),
        ...(params.passengers.children && { childNum: params.passengers.children.toString() }),
        ...(params.passengers.infants && { infantNum: params.passengers.infants.toString() })
      });

      const response = await fetch(`${this.baseUrl}/SimpleHotelSearch/20170426?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RakutenTravelResponse = await response.json();
      const unifiedOffers = this.transformToUnifiedFormat(data);

      return {
        success: true,
        data: unifiedOffers
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RAKUTEN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
    }
  }

  private transformToUnifiedFormat(data: RakutenTravelResponse): UnifiedFlightOffer[] {
    return data.flights.map(flight => ({
      id: `rakuten-${flight.flightNo}`,
      source: 'rakuten' as const,
      route: {
        departure: flight.departure.airport,
        arrival: flight.arrival.airport,
        departureTime: flight.departure.time,
        arrivalTime: flight.arrival.time
      },
      pricing: {
        currency: 'JPY',
        totalPrice: flight.price,
        basePrice: Math.floor(flight.price * 0.85), // 推定
        taxes: Math.floor(flight.price * 0.15) // 推定
      },
      airline: {
        code: this.extractAirlineCode(flight.airline),
        name: flight.airline
      },
      availability: {
        seats: flight.availableSeats,
        bookingClass: 'Y' // デフォルト
      }
    }));
  }

  private extractAirlineCode(airlineName: string): string {
    const airlineMap: { [key: string]: string } = {
      'ANA': 'NH',
      '全日空': 'NH',
      'JAL': 'JL',
      '日本航空': 'JL',
      'ソラシドエア': '6J',
      'スカイマーク': 'BC',
      'ピーチ': 'MM',
      'ジェットスター': 'GK'
    };

    for (const [name, code] of Object.entries(airlineMap)) {
      if (airlineName.includes(name)) {
        return code;
      }
    }

    return 'XX'; // 不明な場合
  }
}
