# 🚀 実データ化への道筋

## 📊 現在の状況
現在のアプリケーションは**モックデータ**を使用して動作しています。実際のサービスとして運用するには、以下のAPI連携が必要です。

## 🔗 主要API統合戦略

### 1️⃣ 航空会社API

#### ANA API
- **現状**: 公式開発者APIは**一般公開されていない**
- **代替手段**: 
  - スクレイピング（利用規約要確認）
  - パートナープログラムへの申請
  - NDC（New Distribution Capability）経由

#### JAL API
- **現状**: 企業向けパートナーシップのみ
- **代替手段**: 
  - 法人契約による直接統合
  - 旅行代理店API経由

#### ソラシドエア等LCC
- **現状**: 限定的なAPI提供
- **代替手段**: 
  - 個別パートナーシップ交渉
  - アグリゲーターAPI経由

### 2️⃣ 価格比較API

#### Skyscanner API ⭐ **推奨**
- **提供内容**: Flight Live Prices, Flight Indicative Prices
- **利用可能**: [developers.skyscanner.net](https://developers.skyscanner.net/)
- **対応データ**: リアルタイム価格、在庫状況、複数航空会社
- **制限**: 商用利用には申請必要

#### RapidAPI Travel Collection
- **提供内容**: 複数の航空会社API統合
- **メリット**: 統一インターフェース
- **課金**: API使用量ベース

#### Amadeus API
- **提供内容**: Flight Offers Search, Flight Booking
- **企業向け**: 大規模統合に適している
- **認証**: 企業認証必要

### 3️⃣ 楽天トラベル等国内API

#### 楽天トラベル API
- **提供内容**: 国内航空券検索・予約
- **認証**: 楽天ウェブサービスAPIキー
- **特徴**: 国内線に特化

## 💻 実装ロードマップ

### Phase 1: Skyscanner API統合
```typescript
// 実装予定のAPIサービス
interface SkyscannerAPI {
  searchFlights(params: FlightSearchParams): Promise<FlightOffer[]>;
  getLivePrices(sessionKey: string): Promise<PriceUpdate[]>;
  getIndicativePrices(route: Route): Promise<PriceCalendar>;
}
```

### Phase 2: 国内API統合
```typescript
// 楽天トラベルAPI統合
interface RakutenTravelAPI {
  searchDomesticFlights(params: DomesticSearchParams): Promise<DomesticFlight[]>;
  getAvailability(flightId: string): Promise<AvailabilityInfo>;
}
```

### Phase 3: マイル特化機能
```typescript
// マイル関連APIラッパー
interface MileageAPI {
  getAwardAvailability(route: Route, date: Date): Promise<AwardSeat[]>;
  calculateRequiredMiles(route: Route, season: Season): Promise<MileRequirement>;
  getDiscountPrograms(): Promise<DiscountProgram[]>;
}
```

## 📋 次のステップ

1. **Skyscanner API申請・検証**
2. **楽天トラベルAPI登録**
3. **データ統合ロジック実装**
4. **レート制限・キャッシング戦略**
5. **エラーハンドリング強化**

## 🛠 技術実装要件

### 環境変数設定
```env
SKYSCANNER_API_KEY=your_api_key
RAKUTEN_APP_ID=your_app_id
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
```

### APIクライアント設計
```typescript
// src/services/apiClients/
├── skyscannerClient.ts
├── rakutenClient.ts
├── amadeusClient.ts
└── index.ts
```

### データ正規化
```typescript
// 各APIのレスポンスを統一形式に変換
interface UnifiedFlightData {
  source: 'skyscanner' | 'rakuten' | 'amadeus';
  route: Route;
  prices: PriceInfo[];
  availability: AvailabilityInfo;
  mileage?: MileageInfo;
}
```

## 💰 コスト試算

| API | 無料枠 | 有料プラン | 特徴 |
|-----|-------|-----------|------|
| Skyscanner | 制限あり | 要問い合わせ | 包括的データ |
| 楽天トラベル | 1000回/日 | 従量課金 | 国内特化 |
| Amadeus | 2000回/月 | $1/1000回 | 企業向け |

現在の開発段階では**Skyscanner API**での検証から開始することを推奨します。
