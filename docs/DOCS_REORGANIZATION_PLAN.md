# docsディレクトリ整理計画
## Documentation Reorganization Plan

**目的**: 開発効率向上・情報アクセス最適化・重複削除  
**方針**: 役割別分類・最新情報の一元化・古い情報の整理  
**実行日**: 2025年1月

---

## 📋 現状分析

### 🔍 現在のドキュメント分類

#### **設計・アーキテクチャ系**
- ✅ `DESIGN_DOCUMENT.md` - **最新・包括的**
- ❌ `ARCHITECTURE.md` - **古い・重複**

#### **戦略・計画系**
- ✅ `PROJECT_STRATEGY.md` - **最新・詳細**
- ❌ `COMPREHENSIVE_STRATEGY_2025.md` - **重複**

#### **品質・技術系**
- ✅ `QUALITY_CHECKLIST.md` - **必須・最新**
- ✅ `TECHNICAL_INSIGHTS.md` - **必須・最新**

#### **データ収集・AI活用系**
- ✅ `AI_PROMPTS_FOR_MILE_DATA.md` - **活用中**
- ✅ `REMAINING_17_PROGRAMS_EXTRACTION_PROMPTS.md` - **活用中**
- ❌ `QUICK_AI_PROMPTS.md` - **重複内容**

#### **分析・レポート系**
- ✅ `MILE_VALUE_ANALYSIS_REPORT.md` - **最新成果**
- ❌ `PHASE1_COMPLETION_REPORT.md` - **古いフェーズ**
- ❌ `CLEANUP_SUMMARY.md` - **一時的レポート**

---

## 🎯 整理後の目標構造

### 📁 **アクティブドキュメント** (開発で頻繁に参照)

```
docs/
├── 01_DESIGN/
│   ├── DESIGN_DOCUMENT.md          # 設計書（メイン）
│   └── TECHNICAL_INSIGHTS.md       # 技術知見・ベストプラクティス
│
├── 02_STRATEGY/
│   ├── PROJECT_STRATEGY.md         # プロジェクト戦略（メイン）
│   └── MILE_VALUE_ANALYSIS_REPORT.md # 分析成果
│
├── 03_DEVELOPMENT/
│   ├── QUALITY_CHECKLIST.md        # 品質保証プロセス
│   └── SERVICE_READINESS_ASSESSMENT.md # サービス準備状況
│
├── 04_DATA_COLLECTION/
│   ├── AI_PROMPTS_FOR_MILE_DATA.md # AIデータ収集プロンプト
│   ├── REMAINING_17_PROGRAMS_EXTRACTION_PROMPTS.md # 残り抽出
│   └── MILE_DATA_COMPARISON_TEMPLATE.md # 比較テンプレート
│
└── 05_GUIDES/
    ├── MILE_VALUE_CALCULATION_GUIDE.md # 計算ガイド
    ├── MILE_TRANSFER_STRATEGY_GUIDE.md # 転送戦略
    └── PARTNER_AIRLINE_AWARD_STRATEGY.md # パートナー戦略
```

### 📁 **アーカイブ** (履歴保存・参照用)

```
docs/archive/
├── historical/
│   ├── ARCHITECTURE.md             # 古い設計書
│   ├── COMPREHENSIVE_STRATEGY_2025.md # 古い戦略
│   ├── PHASE1_COMPLETION_REPORT.md # Phase1完了レポート
│   └── CLEANUP_SUMMARY.md          # クリーンアップサマリー
│
├── temporary_reports/
│   ├── AMERICAN_AIRLINES_EXTRACTION_REPORT.md
│   └── BOOKING_SYSTEM_IMPLEMENTATION_REPORT.md
│
└── legacy_prompts/
    ├── QUICK_AI_PROMPTS.md
    └── PHASE1_DATA_COLLECTION_PROMPT.md
```

---

## 🔄 統合・更新が必要なファイル

### 1. **PROJECT_STRATEGY.md** (メイン戦略書)
**現状**: 2025年7月日付だが実際は1月  
**更新内容**:
- 日付の正確化 (2025年1月)
- 最新の実装状況反映
- 品質強化・モジュール化完了状況
- 今後のロードマップ明確化

### 2. **README.md** (プロジェクト概要)
**現状**: 基本情報のみ  
**強化内容**:
- 最新機能・品質状況
- 開発者向けクイックスタート
- ドキュメント構造への案内

### 3. **新規作成: DEVELOPMENT_INDEX.md**
**目的**: 開発者向けナビゲーション  
**内容**:
- 各ドキュメントの役割・用途
- 開発フェーズ別必読ドキュメント
- クイックリファレンス

---

## ⚡ 実行アクション

### 🚀 **即座実行** (今すぐ)

1. **ディレクトリ構造作成**
   ```bash
   mkdir docs/01_DESIGN docs/02_STRATEGY docs/03_DEVELOPMENT 
   mkdir docs/04_DATA_COLLECTION docs/05_GUIDES docs/archive
   ```

2. **アクティブファイル移動・整理**
   - 最新・重要ファイルを新構造に配置
   - 重複ファイルの統合・削除

3. **アーカイブ移動**
   - 古い・重複ファイルをarchiveへ移動
   - 履歴保存・将来参照用

### 📝 **更新作業** (今週中)

1. **PROJECT_STRATEGY.md更新**
   - 日付・実装状況の正確化
   - 最新ロードマップ反映

2. **README.md強化**
   - 最新状況・機能説明
   - 開発者オンボーディング情報

3. **DEVELOPMENT_INDEX.md作成**
   - 全ドキュメントのナビゲーション
   - 開発者ガイド

---

## 📊 期待効果

### ✅ **開発効率向上**
- 必要情報への素早いアクセス
- 重複確認作業の削減
- 新規開発者のオンボーディング高速化

### ✅ **品質保証**
- 最新情報の一元管理
- 古い情報による混乱防止
- 一貫性のある開発プロセス

### ✅ **拡張性確保**
- 新機能・新ドキュメントの追加容易性
- 役割別分類による保守性向上
- プロジェクト成長への対応

---

## 🎯 整理後の開発フロー

### **新機能開発時**
1. `01_DESIGN/DESIGN_DOCUMENT.md` で設計確認
2. `03_DEVELOPMENT/QUALITY_CHECKLIST.md` で品質確認
3. `02_STRATEGY/PROJECT_STRATEGY.md` で戦略整合性確認

### **データ収集・分析時**
1. `04_DATA_COLLECTION/` で適切なプロンプト選択
2. `05_GUIDES/` で分析・計算ガイド参照
3. 結果を該当レポートに反映

### **品質保証時**
1. `03_DEVELOPMENT/QUALITY_CHECKLIST.md` で全項目確認
2. `01_DESIGN/TECHNICAL_INSIGHTS.md` でベストプラクティス確認
3. 問題発見時は該当ドキュメントに記録

---

**この整理により、開発効率・品質・拡張性すべてが向上し、プロジェクトの持続的成長を支援します。**
