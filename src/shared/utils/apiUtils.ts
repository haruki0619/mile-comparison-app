// 🎯 API Common Utilities - API呼び出しの共通処理
import { APIResponse, APIError, ResponseMetadata, DataSource } from '../types/api';

export class APIUtils {
  /**
   * 統一されたAPIレスポンス作成
   */
  static createResponse<T>(
    data: T,
    source: DataSource = 'api',
    metadata?: Partial<ResponseMetadata>
  ): APIResponse<T> {
    return {
      success: true,
      data,
      metadata: {
        requestId: this.generateRequestId(),
        timestamp: new Date(),
        executionTime: metadata?.executionTime || 0,
        source,
        cached: metadata?.cached || false
      }
    };
  }

  /**
   * 統一されたエラーレスポンス作成
   */
  static createErrorResponse<T>(
    error: APIError | string,
    source: DataSource = 'api'
  ): APIResponse<T> {
    const apiError: APIError = typeof error === 'string' 
      ? {
          code: 'UNKNOWN_ERROR',
          message: error,
          timestamp: new Date()
        }
      : error;

    return {
      success: false,
      error: apiError,
      metadata: {
        requestId: this.generateRequestId(),
        timestamp: new Date(),
        executionTime: 0,
        source
      }
    };
  }

  /**
   * リクエストID生成
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * API呼び出しを安全に実行
   */
  static async safeApiCall<T>(
    apiCall: () => Promise<T>,
    fallbackData?: T,
    timeoutMs: number = 5000
  ): Promise<APIResponse<T>> {
    const startTime = Date.now();
    
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });

      const result = await Promise.race([apiCall(), timeoutPromise]);
      const executionTime = Date.now() - startTime;

      return this.createResponse(result, 'api', { executionTime });

    } catch (error) {
      console.warn('API呼び出しエラー、フォールバックデータを使用:', error);
      
      if (fallbackData) {
        const executionTime = Date.now() - startTime;
        return this.createResponse(fallbackData, 'fallback', { executionTime });
      }

      return this.createErrorResponse(
        error instanceof Error ? error.message : 'Unknown API error'
      );
    }
  }

  /**
   * CORS対応チェック
   */
  static isCorsError(error: unknown): boolean {
    return error instanceof Error && (
      error.message.includes('CORS') ||
      error.message.includes('Cross-Origin') ||
      error.message.includes('Network Error')
    );
  }

  /**
   * レート制限チェック
   */
  static isRateLimited(error: unknown): boolean {
    return error instanceof Error && (
      error.message.includes('rate limit') ||
      error.message.includes('429') ||
      error.message.includes('Too Many Requests')
    );
  }
}

/**
 * 価格フォーマッティングユーティリティ
 */
export class PriceUtils {
  static formatCurrency(amount: number, currency: 'JPY' | 'USD' | 'EUR' = 'JPY'): string {
    const formatters = {
      JPY: new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' })
    };

    return formatters[currency].format(amount);
  }

  static calculateTotalPrice(basePrice: number, taxes: number, fees: number = 0): number {
    return basePrice + taxes + fees;
  }

  static calculateValuePerMile(totalPrice: number, requiredMiles: number): number {
    return totalPrice / requiredMiles;
  }
}

/**
 * 日時処理ユーティリティ
 */
export class DateTimeUtils {
  static formatFlightTime(time: string): string {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static calculateFlightDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(`1970-01-01T${departureTime}`);
    const arrival = new Date(`1970-01-01T${arrivalTime}`);
    
    const diffMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
