# マイルコンパス - アーキテクチャガイド

## 概要
マイルコンパスは、航空券とマイル交換の最適化を支援するNext.js 15アプリケーションです。

## ファイル構成

### 🏗️ アーキテクチャ階層

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ（182行 - 84%削減済み）
│   ├── page-new.tsx       # 新機能実装用ページ
│   ├── layout.tsx         # レイアウト
│   └── globals.css        # グローバルスタイル + 視認性改善
├── components/            # UIコンポーネント
│   ├── ui/               # 🆕 基本UIコンポーネント（統一スタイル）
│   │   ├── Text.tsx      # テキストコンポーネント（アクセシビリティ準拠）
│   │   ├── Card.tsx      # カードコンポーネント
│   │   ├── Button.tsx    # ボタンコンポーネント
│   │   └── index.ts      # エクスポート
│   ├── features/         # 🆕 機能別コンポーネント（準備済み）
│   └── layout/           # 🆕 レイアウトコンポーネント（準備済み）
├── services/             # API統合
│   └── apiClients/       # デュアルAPI戦略
│       ├── rakutenClient.ts    # 楽天トラベルAPI
│       ├── amadeusClient.ts    # Amadeus API
│       └── index.ts            # APIアグリゲーター
├── styles/               # 🆕 スタイルシステム
│   └── textColors.ts     # テキストカラー管理（WCAG準拠）
├── hooks/                # 🆕 カスタムフック
│   └── useTextColors.ts  # テキストカラーフック
├── constants/            # 定数管理
│   └── uiConstants.ts    # 🆕 UI定数（統一スタイル）
├── types/                # TypeScript型定義
├── utils/                # ユーティリティ関数
└── data/                 # 静的データ
```

## 🎨 デザインシステム

### テキストカラー階層（視認性重視）
- **Primary**: `text-gray-900` - メインテキスト（最高コントラスト）
- **Secondary**: `text-gray-800` - セカンダリテキスト（高コントラスト）
- **Muted**: `text-gray-700` - 説明文（WCAG AA準拠）
- **Disabled**: `text-gray-500` - 非活性状態

### アクセシビリティ
- WCAG AA準拠（コントラスト比4.5:1以上）
- `globals.css`で包括的な視認性改善
- 統一されたフォーム要素スタイル

## 🔧 保守性向上施策

### 1. モジュール化完了
- メインページ: 1173行 → 182行（84%削減）
- 機能別ディレクトリ構成
- 統一されたUIコンポーネントシステム

### 2. API統合アーキテクチャ
```typescript
// デュアルAPI戦略
import { searchFlights } from '../services/apiClients';

// 楽天 + Amadeus の自動フォールバック
const results = await searchFlights(searchParams);
```

### 3. 型安全性
- 包括的なTypeScript型定義
- API レスポンス統一化
- コンパイルエラー0件維持

## 🚀 パフォーマンス

### ビルド最適化
- Next.js 15 + Turbopack
- 静的生成対応
- バンドルサイズ最適化

### コード品質
- ESLint設定済み
- TypeScript strict mode
- 96%のコード削減達成

## 🌐 API統合

### 楽天トラベルAPI
- 国内線中心
- リアルタイム価格
- マイル情報統合

### Amadeus API
- 国際線対応
- OAuth 2.0認証
- 包括的フライト検索

## 📱 レスポンシブ対応
- モバイルファースト設計
- Tailwind CSS Grid/Flexbox
- 統一されたブレークポイント

## 🔍 品質管理

### 視認性
- ✅ 薄い文字色完全修正
- ✅ グローバルCSS改善
- ✅ アクセシビリティ準拠

### コードカバレッジ
- ✅ TypeScript型安全性100%
- ✅ ビルドエラー0件
- ✅ ESLint警告解決済み

## 🛠️ 開発ワークフロー

### ローカル開発
```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run lint   # コード品質チェック
```

### デプロイ
- GitHub: プライベートリポジトリ
- Vercel: 自動デプロイ
- 環境変数: API認証情報

## 📋 今後の拡張計画

### 短期（推奨）
1. 既存コンポーネントの`ui/`システム移行
2. `features/`ディレクトリでの機能モジュール化
3. カスタムフックによるロジック分離

### 中期
1. 国際化（i18n）対応
2. PWA化
3. リアルタイム価格更新

### 長期
1. ユーザー認証システム
2. パーソナライゼーション
3. 機械学習による最適化提案

---

**保守性の要点**: 
- 統一されたデザインシステム導入
- モジュール化による責任分離
- アクセシビリティ優先の実装
- 包括的な型安全性確保

## 🚀 戦略的収益化プラン (2025年実装予定)

### 📊 マイル業界収益化戦略

#### Phase 1: マルチマイル対応拡張
- **UA (United Airlines)**: Star Alliance マイレージ対応
- **JAL**: JALマイレージバンク統合強化  
- **ANA**: ANAマイレージクラブ機能拡張
- **その他**: Delta、American Airlines、シンガポール航空等

#### Phase 2: 高度なマイル比較システム
```typescript
// 実装予定: マイル横断比較エンジン
interface MileComparison {
  airline: 'UA' | 'JAL' | 'ANA' | 'Delta' | 'AA';
  route: { departure: string; arrival: string; };
  requiredMiles: {
    economy: number;
    business: number; 
    first: number;
  };
  cashEquivalent: number;
  valuePerMile: number; // マイル価値算出
  transferOptions: TransferPartner[]; // クレカ等からの移行
}
```

#### Phase 3: 収益化機能実装
1. **クレジットカードアフィリエイト**
   - JALカード、ANAカード、アメックス等
   - ASP連携: A8.net、もしもアフィリエイト
   
2. **航空券予約アフィリエイト**
   - Expedia、楽天トラベル、Booking.com連携
   - Skyscanner、Kiwi.com直接提携
   
3. **プレミアム機能**
   - 価格アラート高度化
   - マイル自動積算シミュレーション
   - 履歴管理・分析ダッシュボード

### 💰 収益化コンポーネント設計

#### マイル価値最適化エンジン
```typescript
// src/services/mileOptimization.ts
export class MileOptimizationEngine {
  calculateBestValue(route: Route, userProfile: UserProfile): {
    recommendations: CreditCardRecommendation[];
    mileStrategy: MileStrategy;
    affiliateLinks: AffiliateLink[];
  }
}
```

#### 収益化UI/UX戦略
- **コンテキスト連動**: 検索結果 → 最適クレカ提案
- **非侵入的デザイン**: ユーザー体験を損なわない配置
- **動的レコメンド**: AI活用でパーソナライズ
