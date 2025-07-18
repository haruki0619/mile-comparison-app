# 航空会社型安全表示の実装ガイド
## Type-Safe Airline Feature Display Implementation Guide

**目的**: 厳密化された航空会社型を活用したUI表示の実装例  
**対象**: UIコンポーネント開発者・新機能追加時の参考  
**更新日**: 2025年1月17日

---

## 🎯 型安全表示の基本パターン

### 1. 航空会社別バッジ表示
```typescript
import { AirlineCode, AirlineMileChartByCode } from '@/types/airlines';

interface AirlineFeatureBadgesProps {
  airlineCode: AirlineCode;
  mileChart: AirlineMileChartByCode<typeof airlineCode>;
}

export function AirlineFeatureBadges({ airlineCode, mileChart }: AirlineFeatureBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* 日本系航空会社の特徴 */}
      {airlineCode === 'ANA' && (
        <>
          {mileChart.specialAwards?.oneWay && (
            <Badge variant="secondary">片道特典対応</Badge>
          )}
          {mileChart.specialAwards?.mixedCabin && (
            <Badge variant="outline">ミックスクラス</Badge>
          )}
          {mileChart.seasonalPricing && (
            <Badge variant="default">シーズン変動</Badge>
          )}
        </>
      )}

      {airlineCode === 'JAL' && (
        <>
          {mileChart.mysteryDestination?.available && (
            <Badge variant="success">どこかにマイル</Badge>
          )}
          {mileChart.specialFeatures?.discountMileage && (
            <Badge variant="secondary">ディスカウントマイル</Badge>
          )}
        </>
      )}

      {/* アメリカ系航空会社の特徴 */}
      {airlineCode === 'UA' && (
        <>
          {mileChart.dynamicPricing && (
            <Badge variant="warning">動的価格制</Badge>
          )}
          {mileChart.excursionist && (
            <Badge variant="success">エクスカーショニスト</Badge>
          )}
          {mileChart.stopovers > 0 && (
            <Badge variant="outline">ストップオーバー{mileChart.stopovers}回</Badge>
          )}
        </>
      )}

      {airlineCode === 'AA' && (
        <>
          {mileChart.dynamicPricing && (
            <Badge variant="warning">動的価格制</Badge>
          )}
          {mileChart.webSpecial && (
            <Badge variant="success">ウェブスペシャル {mileChart.webSpecial.discount}%割引</Badge>
          )}
          {mileChart.milesOrPoints && (
            <Badge variant="outline">マイル+ポイント併用</Badge>
          )}
        </>
      )}

      {airlineCode === 'DL' && (
        <>
          {mileChart.dynamicPricing.enabled && (
            <Badge variant="warning">完全動的価格制</Badge>
          )}
          {mileChart.payWithMiles?.enabled && (
            <Badge variant="secondary">Pay with Miles</Badge>
          )}
          {mileChart.noBlackoutDates && (
            <Badge variant="success">ブラックアウト日なし</Badge>
          )}
        </>
      )}

      {/* ヨーロッパ系航空会社の特徴 */}
      {airlineCode === 'LH' && (
        <>
          {mileChart.milesBargains && (
            <Badge variant="success">マイルズバーゲン {mileChart.milesBargains.discount}%割引</Badge>
          )}
          {mileChart.europeFeatures?.multiCity && (
            <Badge variant="outline">マルチシティ対応</Badge>
          )}
        </>
      )}

      {airlineCode === 'BA' && (
        <>
          {mileChart.distanceBased.enabled && (
            <Badge variant="default">距離ベース価格</Badge>
          )}
          {mileChart.peakOffPeak?.enabled && (
            <Badge variant="secondary">ピーク/オフピーク制</Badge>
          )}
          {mileChart.householdAccount && (
            <Badge variant="outline">家族アカウント</Badge>
          )}
        </>
      )}

      {airlineCode === 'AF' && (
        <>
          {mileChart.flyingBlue?.monthlyPromos && (
            <Badge variant="success">月替わりプロモ</Badge>
          )}
          {mileChart.experienceRewards && (
            <Badge variant="outline">体験型特典</Badge>
          )}
        </>
      )}

      {/* アジア系航空会社の特徴 */}
      {airlineCode === 'SQ' && (
        <>
          {mileChart.spontaneousEscapes && (
            <Badge variant="success">直前割引 {mileChart.spontaneousEscapes.discount}%</Badge>
          )}
          {mileChart.advantageAwards && (
            <Badge variant="secondary">アドバンテージアワード</Badge>
          )}
          {mileChart.waitlist && (
            <Badge variant="outline">ウェイトリスト対応</Badge>
          )}
        </>
      )}

      {airlineCode === 'CX' && (
        <>
          {mileChart.payWithMiles?.noBlackout && (
            <Badge variant="success">ブラックアウト日なし</Badge>
          )}
          {mileChart.stopoverHongKong && (
            <Badge variant="outline">香港ストップオーバー</Badge>
          )}
          {mileChart.familyTransfer?.enabled && (
            <Badge variant="secondary">家族間移行</Badge>
          )}
        </>
      )}

      {airlineCode === 'TG' && (
        <>
          {mileChart.bangkokStopover?.complimentary && (
            <Badge variant="success">バンコク無料ストップオーバー</Badge>
          )}
          {mileChart.asianTravel?.multiDestination && (
            <Badge variant="outline">東南アジア周遊</Badge>
          )}
        </>
      )}

      {/* 中東系航空会社の特徴 */}
      {airlineCode === 'QR' && (
        <>
          {mileChart.qsuites?.available && (
            <Badge variant="success">Qsuite対応</Badge>
          )}
          {mileChart.stopoverProgram?.doha && (
            <Badge variant="outline">ドハ無料ストップオーバー</Badge>
          )}
          {mileChart.familyTransfers && (
            <Badge variant="secondary">家族間移行</Badge>
          )}
        </>
      )}

      {airlineCode === 'EK' && (
        <>
          {mileChart.flexRewards?.enabled && (
            <Badge variant="success">Flex Rewards</Badge>
          )}
          {mileChart.stopoverDubai?.complimentary && (
            <Badge variant="outline">ドバイ無料ストップオーバー</Badge>
          )}
          {mileChart.noExpiry && (
            <Badge variant="warning">マイル無期限</Badge>
          )}
        </>
      )}
    </div>
  );
}
```

### 2. 詳細情報表示コンポーネント
```typescript
export function AirlineDetailedInfo({ airlineCode, mileChart }: AirlineFeatureBadgesProps) {
  return (
    <div className="space-y-4">
      {/* 基本情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">アライアンス</label>
          <p className="text-sm text-gray-600">{mileChart.alliance}</p>
        </div>
        <div>
          <label className="text-sm font-medium">プログラム</label>
          <p className="text-sm text-gray-600">{mileChart.program}</p>
        </div>
      </div>

      {/* 航空会社別特徴の詳細表示 */}
      {airlineCode === 'UA' && (
        <div className="space-y-2">
          <h3 className="font-medium">United特有の特徴</h3>
          <ul className="text-sm space-y-1">
            {mileChart.excursionist && <li>• エクスカーショニスト特典利用可能</li>}
            {mileChart.openJaw && <li>• オープンジョー対応</li>}
            <li>• ストップオーバー: {mileChart.stopovers}回まで</li>
          </ul>
        </div>
      )}

      {airlineCode === 'SQ' && (
        <div className="space-y-2">
          <h3 className="font-medium">Singapore Airlines特有の特徴</h3>
          <ul className="text-sm space-y-1">
            {mileChart.spontaneousEscapes && (
              <li>• 直前割引: {mileChart.spontaneousEscapes.discount}%（{mileChart.spontaneousEscapes.bookingWindow}日前まで）</li>
            )}
            {mileChart.advantageAwards && (
              <li>• アドバンテージアワード: プレミアムクラス{mileChart.advantageAwards.premiumCabinDiscount}%割引</li>
            )}
          </ul>
        </div>
      )}

      {/* 他の航空会社も同様に... */}
    </div>
  );
}
```

### 3. 検索結果での活用例
```typescript
// SearchResults.tsx での利用例
export function EnhancedAirlineResult({ airline, mileChart }: { 
  airline: AirlineMileInfo; 
  mileChart: AnyAirlineMileChart 
}) {
  const airlineCode = airline.airline as AirlineCode;
  
  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* 基本情報 */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{airline.airline}</h3>
          <p className="text-sm text-gray-600">
            {(airline.miles?.regular || 0).toLocaleString()}マイル
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">
            ¥{(airline.cashPrice || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 型安全な特徴表示 */}
      <AirlineFeatureBadges 
        airlineCode={airlineCode} 
        mileChart={mileChart} 
      />

      {/* 予約情報（型安全） */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>予約開始: {airline.bookingStartDays ? `${airline.bookingStartDays}日前` : '未設定'}</p>
        
        {/* 航空会社別の特殊な予約条件 */}
        {airlineCode === 'ANA' && mileChart.partnerBooking?.waitlist && (
          <p>キャンセル待ち: 利用可能</p>
        )}
        
        {airlineCode === 'JAL' && mileChart.advanceBooking && (
          <p>国際線予約: {mileChart.advanceBooking}日前から</p>
        )}
      </div>
    </div>
  );
}
```

---

## 🔍 型安全性チェックポイント

### 1. 必須の型ガード
```typescript
// ✅ 安全なパターン
if (airlineCode === 'ANA' && 'specialAwards' in mileChart) {
  // ANAMileChart として安全に利用可能
}

// ❌ 危険なパターン
if (airlineCode === 'ANA') {
  // mileChart.specialAwards // 型エラーの可能性
}
```

### 2. オプショナルプロパティの確認
```typescript
// ✅ 安全
{mileChart.specialFeature?.enabled && (
  <span>特別機能利用可能</span>
)}

// ❌ 危険
{mileChart.specialFeature.enabled && ( // undefined エラーリスク
  <span>特別機能利用可能</span>
)}
```

### 3. 型アサーションの適切な使用
```typescript
// ✅ 型ガード付きアサーション
function isANAChart(chart: AnyAirlineMileChart): chart is ANAMileChart {
  return 'specialAwards' in chart;
}

if (isANAChart(mileChart)) {
  // ANAMileChart として安全に利用
  console.log(mileChart.specialAwards.oneWay);
}
```

---

## 📊 パフォーマンス・保守性の考慮

### 1. 条件分岐の最適化
```typescript
// ✅ 効率的なパターン
const getAirlineFeatures = (airlineCode: AirlineCode, mileChart: AnyAirlineMileChart) => {
  switch (airlineCode) {
    case 'ANA':
      return <ANAFeatures chart={mileChart as ANAMileChart} />;
    case 'JAL':
      return <JALFeatures chart={mileChart as JALMileChart} />;
    // ...
    default:
      return null;
  }
};
```

### 2. 共通コンポーネントの活用
```typescript
// 共通バッジコンポーネント
const FeatureBadge = ({ feature, variant, children }: {
  feature: boolean;
  variant: 'success' | 'warning' | 'outline';
  children: React.ReactNode;
}) => feature ? <Badge variant={variant}>{children}</Badge> : null;

// 使用例
<FeatureBadge feature={mileChart.dynamicPricing} variant="warning">
  動的価格制
</FeatureBadge>
```

---

**この実装ガイドにより、型安全で保守性の高い航空会社別UI表示が実現できます。**
