# 開発者向けドキュメントインデックス
## Developer Documentation Index

**目的**: 効率的な開発のためのドキュメントナビゲーション  
**対象**: プロジェクト開発者・新規参加者・保守担当者  
**更新日**: 2025年1月

---

## 🚀 クイックスタート

### **新規開発者向け**
1. **プロジェクト概要**: [`README.md`](../README.md)
2. **設計思想**: [`01_DESIGN/DESIGN_DOCUMENT.md`](01_DESIGN/DESIGN_DOCUMENT.md)
3. **開発環境構築**: [`03_DEVELOPMENT/QUALITY_CHECKLIST.md`](03_DEVELOPMENT/QUALITY_CHECKLIST.md)

### **機能開発時**
1. **戦略確認**: [`02_STRATEGY/PROJECT_STRATEGY.md`](02_STRATEGY/PROJECT_STRATEGY.md)
2. **技術指針**: [`01_DESIGN/TECHNICAL_INSIGHTS.md`](01_DESIGN/TECHNICAL_INSIGHTS.md)
3. **品質チェック**: [`03_DEVELOPMENT/QUALITY_CHECKLIST.md`](03_DEVELOPMENT/QUALITY_CHECKLIST.md)

### **データ作業時**
1. **AIプロンプト**: [`04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md`](04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md)
2. **抽出作業**: [`04_DATA_COLLECTION/REMAINING_17_PROGRAMS_EXTRACTION_PROMPTS.md`](04_DATA_COLLECTION/REMAINING_17_PROGRAMS_EXTRACTION_PROMPTS.md)
3. **分析ガイド**: [`05_GUIDES/MILE_VALUE_CALCULATION_GUIDE.md`](05_GUIDES/MILE_VALUE_CALCULATION_GUIDE.md)

---

## 📁 ドキュメント構造

### **01_DESIGN/** - 設計・アーキテクチャ
| ファイル | 目的 | 更新頻度 | 重要度 |
|---------|------|---------|--------|
| `DESIGN_DOCUMENT.md` | 包括的設計書・型定義・ファクトチェック | 🔄 高 | ⭐⭐⭐ |
| `TECHNICAL_INSIGHTS.md` | 技術知見・ベストプラクティス・教訓 | 🔄 中 | ⭐⭐⭐ |

### **02_STRATEGY/** - 戦略・計画
| ファイル | 目的 | 更新頻度 | 重要度 |
|---------|------|---------|--------|
| `PROJECT_STRATEGY.md` | プロジェクト戦略・ロードマップ・目標 | 🔄 中 | ⭐⭐⭐ |
| `MILE_VALUE_ANALYSIS_REPORT.md` | マイル価値分析・競合比較結果 | 📊 低 | ⭐⭐ |

### **03_DEVELOPMENT/** - 開発・品質保証
| ファイル | 目的 | 更新頻度 | 重要度 |
|---------|------|---------|--------|
| `QUALITY_CHECKLIST.md` | 品質保証チェックリスト・リリース基準 | 🔄 高 | ⭐⭐⭐ |
| `SERVICE_READINESS_ASSESSMENT.md` | サービス準備状況・デプロイ判断 | 📊 中 | ⭐⭐ |

### **04_DATA_COLLECTION/** - データ収集・AI活用
| ファイル | 目的 | 更新頻度 | 重要度 |
|---------|------|---------|--------|
| `AI_PROMPTS_FOR_MILE_DATA.md` | AIデータ収集プロンプト集 | 🔄 高 | ⭐⭐⭐ |
| `REMAINING_17_PROGRAMS_EXTRACTION_PROMPTS.md` | 残りプログラム抽出作業 | 📋 進行中 | ⭐⭐ |
| `MILE_DATA_COMPARISON_TEMPLATE.md` | データ比較・検証テンプレート | 📊 低 | ⭐⭐ |

### **05_GUIDES/** - ガイド・マニュアル
| ファイル | 目的 | 更新頻度 | 重要度 |
|---------|------|---------|--------|
| `MILE_VALUE_CALCULATION_GUIDE.md` | マイル価値計算・アルゴリズム | 📊 低 | ⭐⭐ |
| `MILE_TRANSFER_STRATEGY_GUIDE.md` | マイル転送戦略・最適化 | 📊 低 | ⭐ |
| `PARTNER_AIRLINE_AWARD_STRATEGY.md` | パートナー航空会社戦略 | 📊 低 | ⭐ |

### **archive/** - アーカイブ・履歴
| ディレクトリ | 内容 | 目的 |
|------------|------|------|
| `historical/` | 古い設計書・戦略書 | 履歴保存・参照用 |
| `temporary_reports/` | 一時的なレポート・分析結果 | 作業記録・検証用 |
| `legacy_prompts/` | 古いプロンプト・手順書 | 履歴保存・学習用 |

---

## 🎯 開発フェーズ別ガイド

### **フェーズ1: 初期設定・環境構築**
```bash
# 1. プロジェクト概要理解
📖 README.md

# 2. 設計思想・技術方針確認
📖 01_DESIGN/DESIGN_DOCUMENT.md
📖 01_DESIGN/TECHNICAL_INSIGHTS.md

# 3. 開発環境構築・品質基準理解
📖 03_DEVELOPMENT/QUALITY_CHECKLIST.md
```

### **フェーズ2: 機能開発**
```bash
# 1. 戦略・要件確認
📖 02_STRATEGY/PROJECT_STRATEGY.md

# 2. 設計原則・型定義確認
📖 01_DESIGN/DESIGN_DOCUMENT.md

# 3. 品質チェック実行
📋 03_DEVELOPMENT/QUALITY_CHECKLIST.md

# 4. 技術知見・ベストプラクティス適用
📖 01_DESIGN/TECHNICAL_INSIGHTS.md
```

### **フェーズ3: データ収集・分析**
```bash
# 1. AIプロンプト選択・実行
📖 04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md

# 2. 抽出作業・進捗管理
📋 04_DATA_COLLECTION/REMAINING_17_PROGRAMS_EXTRACTION_PROMPTS.md

# 3. データ分析・価値計算
📖 05_GUIDES/MILE_VALUE_CALCULATION_GUIDE.md

# 4. 結果検証・比較
📊 04_DATA_COLLECTION/MILE_DATA_COMPARISON_TEMPLATE.md
```

### **フェーズ4: リリース準備**
```bash
# 1. 全品質項目チェック
📋 03_DEVELOPMENT/QUALITY_CHECKLIST.md

# 2. サービス準備状況確認
📊 03_DEVELOPMENT/SERVICE_READINESS_ASSESSMENT.md

# 3. 戦略・目標との整合性確認
📖 02_STRATEGY/PROJECT_STRATEGY.md

# 4. 技術的改善点の反映
📝 01_DESIGN/TECHNICAL_INSIGHTS.md
```

---

## 🔍 よくある質問・タスク別ガイド

### **「新機能を追加したい」**
1. 戦略との整合性確認 → [`02_STRATEGY/PROJECT_STRATEGY.md`](02_STRATEGY/PROJECT_STRATEGY.md)
2. 設計原則・型定義確認 → [`01_DESIGN/DESIGN_DOCUMENT.md`](01_DESIGN/DESIGN_DOCUMENT.md)
3. 品質基準・テスト実行 → [`03_DEVELOPMENT/QUALITY_CHECKLIST.md`](03_DEVELOPMENT/QUALITY_CHECKLIST.md)

### **「マイルデータを更新したい」**
1. データ収集プロンプト → [`04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md`](04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md)
2. 比較・検証作業 → [`04_DATA_COLLECTION/MILE_DATA_COMPARISON_TEMPLATE.md`](04_DATA_COLLECTION/MILE_DATA_COMPARISON_TEMPLATE.md)
3. 計算アルゴリズム確認 → [`05_GUIDES/MILE_VALUE_CALCULATION_GUIDE.md`](05_GUIDES/MILE_VALUE_CALCULATION_GUIDE.md)

### **「エラーが発生した」**
1. 技術知見・対処法確認 → [`01_DESIGN/TECHNICAL_INSIGHTS.md`](01_DESIGN/TECHNICAL_INSIGHTS.md)
2. 品質チェック実行 → [`03_DEVELOPMENT/QUALITY_CHECKLIST.md`](03_DEVELOPMENT/QUALITY_CHECKLIST.md)
3. 設計原則・型安全性確認 → [`01_DESIGN/DESIGN_DOCUMENT.md`](01_DESIGN/DESIGN_DOCUMENT.md)

### **「リリース可能か判断したい」**
1. 品質チェックリスト完了確認 → [`03_DEVELOPMENT/QUALITY_CHECKLIST.md`](03_DEVELOPMENT/QUALITY_CHECKLIST.md)
2. サービス準備状況評価 → [`03_DEVELOPMENT/SERVICE_READINESS_ASSESSMENT.md`](03_DEVELOPMENT/SERVICE_READINESS_ASSESSMENT.md)
3. 戦略目標達成状況確認 → [`02_STRATEGY/PROJECT_STRATEGY.md`](02_STRATEGY/PROJECT_STRATEGY.md)

---

## 📊 文書更新ガイドライン

### **更新頻度別管理**

#### **🔄 高頻度更新** (週次・機能追加時)
- `01_DESIGN/DESIGN_DOCUMENT.md`
- `03_DEVELOPMENT/QUALITY_CHECKLIST.md`
- `04_DATA_COLLECTION/AI_PROMPTS_FOR_MILE_DATA.md`

#### **📊 中頻度更新** (月次・フェーズ完了時)
- `02_STRATEGY/PROJECT_STRATEGY.md`
- `01_DESIGN/TECHNICAL_INSIGHTS.md`
- `03_DEVELOPMENT/SERVICE_READINESS_ASSESSMENT.md`

#### **📝 低頻度更新** (四半期・大きな変更時)
- `05_GUIDES/` 内の各ガイド
- `02_STRATEGY/MILE_VALUE_ANALYSIS_REPORT.md`

### **更新時のベストプラクティス**
1. **ファクトチェック**: 公式情報・根拠URL必須
2. **日付記録**: 変更履歴・最終更新日明記
3. **影響範囲**: 関連ドキュメントへの影響確認
4. **検証状況**: 実装済み・未実装・検証中の明示

---

## 🚀 効率的な開発のために

### **毎日の開発開始時**
1. 進行中のタスクに関連するドキュメント確認
2. 品質チェックリストの該当項目確認
3. 技術知見で新しい学習ポイント確認

### **機能完成時**
1. 品質チェックリスト全項目実行
2. 技術知見に新しい学習を記録
3. 設計書への影響・更新の確認

### **週次レビュー時**
1. 戦略との整合性確認
2. サービス準備状況の評価
3. 次週の優先度・タスクの確認

---

**このインデックスを活用して、効率的で高品質な開発を実現しましょう！**
