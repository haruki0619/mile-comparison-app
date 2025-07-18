# 🧭 マイルコンパス (Mile Compass)

包括的航空マイル比較・最適化プラットフォーム - 日本・海外の全主要マイルプログラム対応

## 🌟 主要機能

### ✈️ 包括的マイル比較
- **国内線**: JAL・ANA・LCC各社の完全対応
- **国際線**: 主要10路線・燃油サーチャージ込み計算
- **海外プログラム**: United・American・Delta・British Airways・Singapore・Emirates

### 🔄 アライアンス戦略
- **スターアライアンス**: ANA・United・Singapore・Lufthansa
- **ワンワールド**: JAL・American・British Airways・Cathay Pacific
- **スカイチーム**: Delta・KLM・Air France・Korean Air

### 💰 マイル価値分析
- **効率評価**: マイル使用効率の自動計算
- **節約額表示**: 現金購入との差額明示
- **推奨判定**: 利用・貯める・移行の最適解提案

### 📊 リアルタイムデータ
- **価格カレンダー**: 月別の価格変動を視覚化  
- **価格アラート**: 希望価格でのプッシュ通知
- **予約開始日表示**: 各社の特典航空券予約開始日を表示

## 📁 ドキュメント構造

### 🚀 開発者向けガイド
- **[開発者インデックス](docs/DEVELOPMENT_INDEX.md)** - ドキュメントナビゲーション
- **[整理計画](docs/DOCS_REORGANIZATION_PLAN.md)** - ドキュメント整理戦略

### 📋 主要ドキュメント
- **[設計書](docs/01_DESIGN/DESIGN_DOCUMENT.md)** - 包括的設計・型定義・ファクトチェック
- **[戦略書](docs/02_STRATEGY/PROJECT_STRATEGY.md)** - プロジェクト戦略・ロードマップ
- **[品質チェックリスト](docs/03_DEVELOPMENT/QUALITY_CHECKLIST.md)** - 品質保証プロセス
- **[AIプロンプト集](docs/04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md)** - データ収集支援

## 🏗️ アーキテクチャ

### フロントエンド
- **Next.js 15** + TypeScript
- **React 18+** with Hooks  
- **Tailwind CSS** for styling
- **Lucide React** for icons

### バックエンド統合
- **楽天トラベルAPI** - 国内線特化（優先実装）
- **Skyscanner API** - 包括的な航空券データ（商用利用のみ）
- **Amadeus API** - 企業向け統合（オプション）
- **予約開始日表示**: 各社の特典航空券予約開始日を表示
- **ディスカウント情報**: 特別キャンペーンやタイムセール情報
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

## 🛠 技術スタック

- **フロントエンド**: Next.js 15 + React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **開発環境**: Node.js + npm

## 📦 セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd mile-comparison-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは `http://localhost:3000` でアクセスできます。

## 🎯 使い方

1. **検索フォーム**に出発地・到着地・搭乗日・人数を入力
2. **「マイル・運賃を検索」**ボタンをクリック
3. **検索結果**で各航空会社の情報を比較
4. **詳細情報**ボタンで追加情報を表示
5. **公式サイトで予約**ボタンで各社の予約ページに移動

## 📊 対応航空会社

- **ANA (全日本空輸)**: 355日前から予約可能
- **JAL (日本航空)**: 360日前から予約可能  
- **ソラシドエア**: 90日前から予約可能

## 🗂 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # レイアウトコンポーネント
│   └── page.tsx           # メインページ
├── components/            # UIコンポーネント
│   ├── SearchForm.tsx     # 検索フォーム
│   └── SearchResults.tsx  # 検索結果表示
├── data/                  # 静的データ
│   └── index.ts          # 空港・路線・マイルチャート
├── types/                 # TypeScript型定義
│   └── index.ts          # データ型定義
└── utils/                 # ユーティリティ関数
    └── mileCalculator.ts  # マイル計算ロジック
```

## 🔧 主要な機能

### マイル計算ロジック

- 距離に基づくマイル要件の自動計算
- シーズン別価格設定（ピーク・レギュラー・オフピーク）
- 各社独自のマイルチャートに対応

### シーズン分類

- **ピークシーズン**: 年末年始、GW、お盆等
- **レギュラーシーズン**: 通常期間
- **オフピークシーズン**: 閑散期（一部路線のみ）

### ディスカウント対応

- トクたびマイル（ANA）
- JALタイムセール
- 各社キャンペーン情報

## 🚧 今後の開発予定

### Phase 2
- 国際線対応
- 空席状況のリアルタイム取得
- ユーザーアカウント機能
- お気に入り路線の保存
- プッシュ通知機能

### Phase 3
- 外資系航空会社対応
- マイル有効期限管理
- 高度な比較分析機能

## ⚠️ 注意事項

- このアプリは参考情報を提供するものです
- 実際の予約・搭乗の際は必ず各航空会社の公式サイトでご確認ください
- マイル要件・運賃は変更される場合があります
- 現金価格は概算値です

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

- 🐛 バグ報告: GitHub Issues
- 💡 機能提案: GitHub Discussions  
- 📧 直接連絡: [support@mile-app.com](mailto:support@mile-app.com)
