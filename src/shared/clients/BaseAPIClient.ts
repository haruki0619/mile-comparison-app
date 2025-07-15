// 🎯 Base API Client - 全APIクライアントの基盤
import { APIClient, APIResponse, APIHealthStatus } from '../types/api';
import { Flight, SearchCriteria } from '../types/domain';
import { APIUtils } from '../utils/apiUtils';

export abstract class BaseAPIClient implements APIClient {
  abstract readonly name: string;
  abstract readonly version: string;
  
  protected readonly baseUrl: string;
  protected readonly timeoutMs: number;
  protected readonly retryAttempts: number;

  constructor(
    baseUrl: string,
    timeoutMs: number = 10000,
    retryAttempts: number = 3
  ) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.retryAttempts = retryAttempts;
  }

  /**
   * 共通検索インターフェース - 各実装で具体化
   */
  abstract search(criteria: SearchCriteria): Promise<APIResponse<Flight[]>>;

  /**
   * ヘルスチェック実装
   */
  async healthCheck(): Promise<APIHealthStatus> {
    const startTime = Date.now();
    
    try {
      // 軽量なリクエストでAPIの状態確認
      await this.pingEndpoint();
      
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        issues: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * API固有のping実装（各子クラスでオーバーライド）
   */
  protected async pingEndpoint(): Promise<void> {
    // デフォルト実装: 基本的なURLチェック
    const response = await fetch(this.baseUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(this.timeoutMs)
    });
    
    if (!response.ok) {
      throw new Error(`API ping failed: ${response.status}`);
    }
  }

  /**
   * リトライ付きHTTPリクエスト
   */
  protected async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    attempts: number = this.retryAttempts
  ): Promise<Response> {
    for (let i = 0; i < attempts; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          return response;
        }

        // レート制限の場合は長めに待つ
        if (response.status === 429 && i < attempts - 1) {
          await this.delay(Math.pow(2, i + 1) * 1000);
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        console.warn(`API request attempt ${i + 1} failed:`, error);
        
        if (i === attempts - 1) {
          throw error;
        }
        
        // 指数バックオフで再試行
        await this.delay(Math.pow(2, i) * 1000);
      }
    }

    throw new Error('All retry attempts failed');
  }

  /**
   * 遅延処理
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 共通エラーハンドリング
   */
  protected handleError(error: unknown): APIResponse<Flight[]> {
    console.error(`${this.name} API Error:`, error);

    if (APIUtils.isCorsError(error)) {
      return APIUtils.createErrorResponse({
        code: 'CORS_ERROR',
        message: 'Cross-Origin request blocked. Server-side proxy required.',
        timestamp: new Date()
      });
    }

    if (APIUtils.isRateLimited(error)) {
      return APIUtils.createErrorResponse({
        code: 'RATE_LIMIT',
        message: 'API rate limit exceeded. Please try again later.',
        timestamp: new Date()
      });
    }

    return APIUtils.createErrorResponse({
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown API error',
      timestamp: new Date()
    });
  }

  /**
   * フォールバックデータ生成（各子クラスで実装）
   */
  protected abstract generateFallbackData(criteria: SearchCriteria): Promise<Flight[]>;

  /**
   * 安全な検索実行（フォールバック付き）
   */
  protected async safeSearch(criteria: SearchCriteria): Promise<APIResponse<Flight[]>> {
    try {
      // 実際のAPI呼び出し
      const result = await this.performSearch(criteria);
      return APIUtils.createResponse(result, 'api');

    } catch (error) {
      console.warn(`${this.name} API failed, using fallback data:`, error);
      
      try {
        const fallbackData = await this.generateFallbackData(criteria);
        return APIUtils.createResponse(fallbackData, 'fallback');
      } catch (fallbackError) {
        return this.handleError(fallbackError);
      }
    }
  }

  /**
   * 実際のAPI検索処理（各子クラスで実装）
   */
  protected abstract performSearch(criteria: SearchCriteria): Promise<Flight[]>;
}
